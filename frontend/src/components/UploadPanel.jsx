import { useRef, useState } from 'react'
import Papa from 'papaparse'
import './UploadPanel.css'

export default function UploadPanel({ onData, fileName, loading, serverError }) {
  const inputRef = useRef(null)
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState(null)

  const handleFile = (file) => {
    if (!file) return
    setError(null)
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rows = results.data
          .map((row) => ({
            transaction_id: row.transaction_id || row.id || row.txn_id || '',
            date: row.Date || row.date || row.transaction_date || row.txn_date || '',
            merchant: row.Merchant || row.merchant || row.merchant_name || row.payee || '',
            category: row.Category || row.category || row.expense_category || row.type || '',
            amount: Number(row.Amount || row.amount || row.total || row.value),
            payment_method: row.payment_method || row.paymentMethod || row.method || '',
            city: row.city || row.City || row.location || '',
            hour: row.hour || row.Hour || '',
            weekday: row.weekday || row.Weekday || '',
            is_weekend: row.is_weekend || row.isWeekend || row.weekend || '',
          }))
          .filter((row) => row.date && row.merchant && !Number.isNaN(row.amount))

        if (rows.length === 0) {
          setError('Could not find valid rows. Expected columns like Date, Merchant, Category, Amount.')
          return
        }

        onData(rows, file.name)
      },
      error: () => setError('Could not parse that file as CSV.'),
    })
  }

  const displayError = serverError || error

  return (
    <div className="upload-panel card" id="upload-panel">
      <div
        className={`upload-dropzone ${dragActive ? 'is-active' : ''}`}
        onDragOver={(e) => {
          e.preventDefault()
          setDragActive(true)
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragActive(false)
          handleFile(e.dataTransfer.files?.[0])
        }}
      >
        <div className="upload-icon">↑</div>
        <div className="upload-title">Drop a transaction CSV, or browse</div>
        <div className="upload-sub mono">Date, Merchant, Category, Amount</div>

        <div className="upload-actions">
          <button className="btn-primary" onClick={() => inputRef.current?.click()}>
            {loading ? 'Analyzing…' : 'Choose CSV'}
          </button>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept=".csv"
          hidden
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>

      {displayError && <div className="upload-error">{displayError}</div>}
      {fileName && !displayError && (
        <div className="upload-status mono">
          <span className="upload-status-dot" /> {loading ? 'Analyzing upload…' : `Loaded ${fileName}`}
        </div>
      )}
    </div>
  )
}
