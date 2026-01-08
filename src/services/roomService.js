/**
 * Room Service - F003/F004/F005/F006
 * [INPUT]: Room operations (create, join, leave, update)
 * [OUTPUT]: Room data with realtime subscriptions
 * [POS]: Service Layer - Room Management
 */

import { supabase, isSupabaseConfigured } from '@/lib/supabase'

// Generate a random 6-character room code
function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // Excluded confusing chars: I, O, 0, 1
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

// Generate a unique player ID
function generatePlayerId() {
  return `player_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

/**
 * Create a new game room
 * @param {string} hostName - Name of the host player
 * @param {object} settings - Game settings
 * @returns {Promise<{success: boolean, room?: object, error?: string}>}
 */
export async function createRoom(hostName, settings = {}) {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Supabase not configured' }
  }

  const hostId = generatePlayerId()
  let roomCode = generateRoomCode()

  // Retry with new code if collision (unlikely but possible)
  let attempts = 0
  while (attempts < 5) {
    const { data, error } = await supabase
      .from('imposter_game_rooms')
      .insert({
        room_code: roomCode,
        host_id: hostId,
        host_name: hostName,
        settings: {
          playerCount: settings.playerCount || 6,
          imposterCount: settings.imposterCount || 1,
          category: settings.category || 'animals',
          gameMode: settings.gameMode || 'sequential',
          enableImages: settings.enableImages ?? true,
          quirkiness: settings.quirkiness || 3
        },
        players: [{
          id: hostId,
          name: hostName,
          isHost: true,
          joinedAt: new Date().toISOString()
        }],
        game_state: 'waiting'
      })
      .select()
      .single()

    if (!error) {
      return {
        success: true,
        room: data,
        playerId: hostId
      }
    }

    // If duplicate key, try new code
    if (error.code === '23505') {
      roomCode = generateRoomCode()
      attempts++
    } else {
      return { success: false, error: error.message }
    }
  }

  return { success: false, error: 'Failed to generate unique room code' }
}

/**
 * Join an existing room
 * @param {string} roomCode - The room code to join
 * @param {string} playerName - Name of the joining player
 * @returns {Promise<{success: boolean, room?: object, playerId?: string, error?: string}>}
 */
export async function joinRoom(roomCode, playerName) {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Supabase not configured' }
  }

  // First, get the current room data
  const { data: room, error: fetchError } = await supabase
    .from('imposter_game_rooms')
    .select('*')
    .eq('room_code', roomCode.toUpperCase())
    .single()

  if (fetchError || !room) {
    return { success: false, error: 'Room not found' }
  }

  // Check if game already started
  if (room.game_state !== 'waiting') {
    return { success: false, error: 'Game already in progress' }
  }

  // Check if room is full
  const currentPlayers = room.players || []
  if (currentPlayers.length >= room.settings.playerCount) {
    return { success: false, error: 'Room is full' }
  }

  // Check if name is taken
  if (currentPlayers.some(p => p.name.toLowerCase() === playerName.toLowerCase())) {
    return { success: false, error: 'Name already taken in this room' }
  }

  // Add player to room
  const playerId = generatePlayerId()
  const newPlayer = {
    id: playerId,
    name: playerName,
    isHost: false,
    joinedAt: new Date().toISOString()
  }

  const { data: updatedRoom, error: updateError } = await supabase
    .from('imposter_game_rooms')
    .update({
      players: [...currentPlayers, newPlayer]
    })
    .eq('id', room.id)
    .select()
    .single()

  if (updateError) {
    return { success: false, error: updateError.message }
  }

  return {
    success: true,
    room: updatedRoom,
    playerId
  }
}

/**
 * Get room by code
 * @param {string} roomCode
 * @returns {Promise<{success: boolean, room?: object, error?: string}>}
 */
export async function getRoom(roomCode) {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Supabase not configured' }
  }

  const { data, error } = await supabase
    .from('imposter_game_rooms')
    .select('*')
    .eq('room_code', roomCode.toUpperCase())
    .single()

  if (error || !data) {
    return { success: false, error: 'Room not found' }
  }

  return { success: true, room: data }
}

/**
 * Leave a room
 * @param {string} roomId - Room UUID
 * @param {string} playerId - Player ID to remove
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function leaveRoom(roomId, playerId) {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Supabase not configured' }
  }

  // Get current room
  const { data: room, error: fetchError } = await supabase
    .from('imposter_game_rooms')
    .select('*')
    .eq('id', roomId)
    .single()

  if (fetchError || !room) {
    return { success: false, error: 'Room not found' }
  }

  const currentPlayers = room.players || []
  const leavingPlayer = currentPlayers.find(p => p.id === playerId)

  // If host is leaving, delete the room
  if (leavingPlayer?.isHost) {
    const { error: deleteError } = await supabase
      .from('imposter_game_rooms')
      .delete()
      .eq('id', roomId)

    if (deleteError) {
      return { success: false, error: deleteError.message }
    }
    return { success: true, roomDeleted: true }
  }

  // Otherwise, just remove the player
  const updatedPlayers = currentPlayers.filter(p => p.id !== playerId)

  const { error: updateError } = await supabase
    .from('imposter_game_rooms')
    .update({ players: updatedPlayers })
    .eq('id', roomId)

  if (updateError) {
    return { success: false, error: updateError.message }
  }

  return { success: true }
}

/**
 * Update room settings (host only)
 * @param {string} roomId - Room UUID
 * @param {string} hostId - Host player ID for verification
 * @param {object} settings - New settings
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function updateRoomSettings(roomId, hostId, settings) {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Supabase not configured' }
  }

  // Verify host
  const { data: room, error: fetchError } = await supabase
    .from('imposter_game_rooms')
    .select('*')
    .eq('id', roomId)
    .single()

  if (fetchError || !room) {
    return { success: false, error: 'Room not found' }
  }

  if (room.host_id !== hostId) {
    return { success: false, error: 'Only host can update settings' }
  }

  const { error: updateError } = await supabase
    .from('imposter_game_rooms')
    .update({ settings: { ...room.settings, ...settings } })
    .eq('id', roomId)

  if (updateError) {
    return { success: false, error: updateError.message }
  }

  return { success: true }
}

/**
 * Start the game - assign roles and distribute cards (F005)
 * @param {string} roomId - Room UUID
 * @param {string} hostId - Host player ID
 * @param {object} gameData - Word pair and assignments
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function startGame(roomId, hostId, gameData) {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Supabase not configured' }
  }

  // Verify host
  const { data: room, error: fetchError } = await supabase
    .from('imposter_game_rooms')
    .select('*')
    .eq('id', roomId)
    .single()

  if (fetchError || !room) {
    return { success: false, error: 'Room not found' }
  }

  if (room.host_id !== hostId) {
    return { success: false, error: 'Only host can start the game' }
  }

  const { error: updateError } = await supabase
    .from('imposter_game_rooms')
    .update({
      game_state: 'playing',
      civilian_word: gameData.civilianWord,
      imposter_word: gameData.imposterWord,
      assignments: gameData.assignments
    })
    .eq('id', roomId)

  if (updateError) {
    return { success: false, error: updateError.message }
  }

  return { success: true }
}

/**
 * Subscribe to room changes
 * @param {string} roomCode - Room code to subscribe to
 * @param {function} callback - Called when room changes
 * @returns {function} Unsubscribe function
 */
export function subscribeToRoom(roomCode, callback) {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured, realtime disabled')
    return () => {}
  }

  const channel = supabase
    .channel(`room_${roomCode}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'imposter_game_rooms',
        filter: `room_code=eq.${roomCode.toUpperCase()}`
      },
      (payload) => {
        callback(payload.new, payload.eventType)
      }
    )
    .subscribe()

  // Return unsubscribe function
  return () => {
    supabase.removeChannel(channel)
  }
}

/**
 * Get player's assignment from room
 * @param {object} room - Room data
 * @param {string} playerId - Player ID
 * @returns {object|null} Player's assignment or null
 */
export function getPlayerAssignment(room, playerId) {
  if (!room?.assignments) return null
  return room.assignments.find(a => a.playerId === playerId) || null
}

/**
 * Check if Supabase is available
 */
export { isSupabaseConfigured }
