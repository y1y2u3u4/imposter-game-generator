/**
 * BacklinkTable Component - Cyberpunk styled data table
 * [INPUT]: backlinks array, filters, sorting options
 * [OUTPUT]: Animated sortable table with status indicators
 */

import { motion, AnimatePresence } from "framer-motion"
import { useState, useMemo } from "react"
import { cn } from "@/lib/utils"
import { springs } from "@/lib/motion"
import {
  CheckCircle,
  Clock,
  XCircle,
  ExternalLink,
  ChevronUp,
  ChevronDown,
  Search,
  Filter
} from "lucide-react"

const STATUS_CONFIG = {
  submitted: {
    label: "Submitted",
    icon: CheckCircle,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    glow: "shadow-[0_0_10px_rgba(16,185,129,0.3)]"
  },
  pending: {
    label: "Pending",
    icon: Clock,
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    glow: "shadow-[0_0_10px_rgba(234,179,8,0.3)]"
  },
  failed: {
    label: "Failed",
    icon: XCircle,
    color: "text-red-400",
    bg: "bg-red-500/10",
    glow: "shadow-[0_0_10px_rgba(239,68,68,0.3)]"
  }
}

function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending
  const Icon = config.icon

  return (
    <motion.span
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium font-mono",
        config.bg,
        config.color,
        config.glow
      )}
    >
      <Icon className="w-3 h-3" />
      {config.label}
    </motion.span>
  )
}

function DRBadge({ dr }) {
  const getColor = (value) => {
    if (value >= 70) return { text: "text-emerald-400", bg: "bg-emerald-500/10" }
    if (value >= 40) return { text: "text-cyan-400", bg: "bg-cyan-500/10" }
    return { text: "text-orange-400", bg: "bg-orange-500/10" }
  }
  const colors = getColor(dr)

  return (
    <span className={cn(
      "inline-flex items-center justify-center w-10 h-6 rounded-md text-xs font-bold font-mono",
      colors.bg,
      colors.text
    )}>
      {dr}
    </span>
  )
}

export function BacklinkTable({
  data = [],
  title = "Backlink Submissions",
  showSearch = true,
  showFilter = true
}) {
  const [sortConfig, setSortConfig] = useState({ key: "date", direction: "desc" })
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc"
    }))
  }

  const filteredAndSortedData = useMemo(() => {
    let result = [...data]

    // Filter by search term
    if (searchTerm) {
      result = result.filter(item =>
        item.site.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by status
    if (statusFilter !== "all") {
      result = result.filter(item => item.status === statusFilter)
    }

    // Sort
    result.sort((a, b) => {
      let aValue = a[sortConfig.key]
      let bValue = b[sortConfig.key]

      if (sortConfig.key === "dr") {
        aValue = parseInt(aValue) || 0
        bValue = parseInt(bValue) || 0
      }

      if (sortConfig.key === "date") {
        aValue = new Date(aValue).getTime()
        bValue = new Date(bValue).getTime()
      }

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1
      return 0
    })

    return result
  }, [data, sortConfig, searchTerm, statusFilter])

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) {
      return <ChevronUp className="w-3 h-3 text-zinc-600" />
    }
    return sortConfig.direction === "asc"
      ? <ChevronUp className="w-3 h-3 text-cyan-400" />
      : <ChevronDown className="w-3 h-3 text-cyan-400" />
  }

  const columns = [
    { key: "date", label: "Date", width: "w-28" },
    { key: "site", label: "Site", width: "flex-1" },
    { key: "category", label: "Category", width: "w-32" },
    { key: "dr", label: "DR", width: "w-20" },
    { key: "type", label: "Type", width: "w-24" },
    { key: "status", label: "Status", width: "w-32" }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springs.gentle}
      className="relative rounded-2xl bg-zinc-900/60 backdrop-blur-xl border border-white/5 overflow-hidden"
    >
      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-5 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

      {/* Header */}
      <div className="relative p-6 border-b border-white/5">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <h3 className="text-lg font-semibold text-zinc-100 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            {title}
            <span className="text-sm font-normal text-zinc-500">
              ({filteredAndSortedData.length} records)
            </span>
          </h3>

          <div className="flex items-center gap-3">
            {/* Search */}
            {showSearch && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Search sites..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2 w-48 bg-zinc-800/50 border border-white/5 rounded-lg text-sm text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all font-mono"
                />
              </div>
            )}

            {/* Status Filter */}
            {showFilter && (
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-9 pr-8 py-2 bg-zinc-800/50 border border-white/5 rounded-lg text-sm text-zinc-300 focus:outline-none focus:border-cyan-500/50 appearance-none cursor-pointer font-mono"
                >
                  <option value="all">All Status</option>
                  <option value="submitted">Submitted</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className={cn(
                    "px-6 py-4 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider cursor-pointer hover:text-zinc-300 transition-colors",
                    col.width
                  )}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    <SortIcon columnKey={col.key} />
                  </div>
                </th>
              ))}
              <th className="px-6 py-4 w-16" />
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <AnimatePresence mode="popLayout">
              {filteredAndSortedData.map((row, index) => (
                <motion.tr
                  key={row.id || index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.02, ...springs.snappy }}
                  className="group hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-6 py-4 text-sm text-zinc-400 font-mono">
                    {row.date}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-zinc-200 group-hover:text-cyan-400 transition-colors">
                        {row.site}
                      </span>
                      {row.url && (
                        <span className="text-xs text-zinc-600 truncate max-w-xs">
                          {row.url}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-zinc-500 bg-zinc-800/50 px-2 py-1 rounded font-mono">
                      {row.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <DRBadge dr={row.dr} />
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "text-xs font-mono",
                      row.type === "dofollow" ? "text-emerald-400" : "text-zinc-500"
                    )}>
                      {row.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={row.status} />
                  </td>
                  <td className="px-6 py-4">
                    {row.url && (
                      <a
                        href={row.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-zinc-600 hover:text-cyan-400 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>

        {/* Empty State */}
        {filteredAndSortedData.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-zinc-500">
            <Search className="w-12 h-12 mb-4 opacity-20" />
            <p className="text-sm">No backlinks found</p>
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div className="relative p-4 border-t border-white/5 bg-zinc-900/30">
        <div className="flex items-center justify-between text-xs text-zinc-500 font-mono">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Submitted: {data.filter(d => d.status === "submitted").length}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-yellow-400" />
              Pending: {data.filter(d => d.status === "pending").length}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-400" />
              Failed: {data.filter(d => d.status === "failed").length}
            </span>
          </div>
          <span>
            Avg DR: {Math.round(data.reduce((sum, d) => sum + (d.dr || 0), 0) / (data.length || 1))}
          </span>
        </div>
      </div>
    </motion.div>
  )
}

export default BacklinkTable
