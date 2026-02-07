'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase-client'
import { Badge } from '@/components/ui/badge'
import { MapPin } from 'lucide-react'

type Incident = {
  id: string
  name: string | null
  priority: 'low' | 'medium' | 'high' | 'critical' | null
  risk?: 'low' | 'medium' | 'high' | 'critical' | null // Backward compatibility
  lat: number | null
  lon: number | null
  containment: number | null
  last_update: string
  incident_type?: string | null
}

function PriorityBadge({ priority, risk }: { priority?: Incident['priority'], risk?: Incident['risk'] }) {
  // Support both 'priority' (police) and 'risk' (fire) for backward compatibility
  const level = priority || risk || null;
  const color =
    level === 'critical' ? '#FF6B00' :
    level === 'high' ? '#FF4444' :
    level === 'medium' ? '#FFA800' :
    '#00C2FF'
  return (
    <Badge className="border-0 text-xs font-medium px-2 py-1 whitespace-nowrap flex-shrink-0"
      style={{ backgroundColor: `${color}33`, color }}>
      {level ? level[0].toUpperCase() + level.slice(1) : 'N/A'}
    </Badge>
  )
}

interface IncidentsListProps {
  onIncidentClick?: (incident: Incident) => void;
  onIncidentCountChange?: (count: number) => void;
  onIncidentsUpdate?: (incidents: Incident[]) => void;
}

export default function IncidentsList({ onIncidentClick, onIncidentCountChange, onIncidentsUpdate }: IncidentsListProps) {
  const [rows, setRows] = useState<Incident[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    ;(async () => {
      const { data, error } = await supabase
        .from('incidents')
        .select('*')
        .order('last_update', { ascending: false })
        .limit(25)

      if (cancelled) return
      if (error) setError(error.message)
      else {
        const incidents = (data ?? []) as Incident[]
        setRows(incidents)
        onIncidentCountChange?.(incidents.length)
        onIncidentsUpdate?.(incidents)
      }
      setLoading(false)
    })()

    // realtime updates
    const ch = supabase
      .channel('incidents-rt')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'incidents' },
        payload => {
          const n = payload.new as Incident
          setRows(prev => {
            const without = prev.filter(i => i.id !== n.id)
            const newRows = [n, ...without].slice(0, 25)
            onIncidentCountChange?.(newRows.length)
            onIncidentsUpdate?.(newRows)
            return newRows
          })
        })
      .subscribe()

    return () => { cancelled = true; supabase.removeChannel(ch) }
  }, [])

  if (loading) return <div className="text-white/70 text-sm">Loading…</div>
  if (error)   return <div className="text-red-400 text-sm">Error: {error}</div>
  if (!rows.length) return <div className="text-white/60 text-sm">No incidents yet.</div>

  return (
    <div className="space-y-4">
      {rows.map((r) => (
        <div
          key={r.id}
          className={`bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 rounded-lg p-4 transition-all duration-200 hover:scale-[1.02] overflow-hidden ${
            r.lat && r.lon && !isNaN(r.lat) && !isNaN(r.lon) && r.lat !== 0 && r.lon !== 0
              ? 'cursor-pointer' 
              : 'cursor-not-allowed opacity-60'
          }`}
          onClick={() => onIncidentClick?.(r)}
        >
          <div className="flex items-start justify-between mb-3">
            <span className="text-xs font-mono text-white/50">{r.id.slice(0,8).toUpperCase()}</span>
            <PriorityBadge priority={r.priority} risk={r.risk} />
          </div>

          <p className="text-sm font-semibold mb-2 text-white break-words leading-tight">
            {r.name ?? 'Unnamed Incident'}
          </p>

          <div className="flex items-center gap-2 text-xs text-white/60">
            <MapPin className="w-3 h-3" />
            <span>
              {r.lat?.toFixed(1) ?? '—'}°N, {r.lon?.toFixed(1) ?? '—'}°W
            </span>
          </div>

          <div className="flex items-center justify-between mt-2">
            <div className="text-xs text-white/50">
              Status:{' '}
              <span className="text-[#00C2FF] font-medium">
                {(r.containment ?? 0)}% resolved
              </span>
            </div>
            {r.incident_type && (
              <span className="text-xs text-white/40 italic">
                {r.incident_type}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
