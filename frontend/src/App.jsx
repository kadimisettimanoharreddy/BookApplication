import { useMemo, useState } from 'react'
import './App.css'
import { addBook, getBook, deleteBook, editBook } from './api'

export default function App() {
  const [mode, setMode] = useState('add')
  const [form, setForm] = useState({ org_id: '', name: '', author: '', year: '' })
  const [editField, setEditField] = useState('name')
  const [message, setMessage] = useState(null)

  const title = useMemo(() => ({
    add: 'Add Book',
    get: 'Get Book',
    delete: 'Delete Book',
    edit: 'Edit Book',
  }[mode]), [mode])

  function onChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  async function onSubmit(e) {
    e.preventDefault()
    setMessage(null)
    try {
      if (mode === 'add') {
        const payload = {
          org_book_id: form.org_id.trim(),
          name: form.name.trim(),
          author: form.author.trim(),
          year: Number(form.year)
        }
        const res = await addBook(payload)
        setMessage({ type: 'success', text: `Book added successfully. ID: ${res.org_book_id}` })
        setForm({ org_id: '', name: '', author: '', year: '' })
      } else if (mode === 'get') {
        const res = await getBook(form.org_id.trim())
        setMessage({ type: 'success', text: `Found: ${res.name} by ${res.author} (${res.year})`, data: res })
      } else if (mode === 'delete') {
        await deleteBook(form.org_id.trim())
        setMessage({ type: 'success', text: 'Deleted successfully.' })
      } else if (mode === 'edit') {
        const patch = {}
        if (editField === 'year') patch.year = Number(form.year)
        if (editField === 'name') patch.name = form.name.trim()
        if (editField === 'author') patch.author = form.author.trim()
        const res = await editBook(form.org_id.trim(), patch)
        setMessage({ type: 'success', text: 'Edited successfully.', data: res })
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.message || String(err) })
    }
  }

  return (
    <div className="container">
      <div className="card">
        <h1 className="row" style={{justifyContent:'space-between'}}>
          <span>📚 Book Keeper</span>
          <select className="select" value={mode} onChange={e => setMode(e.target.value)} style={{maxWidth:220}}>
            <option value="add">Add</option>
            <option value="get">Get</option>
            <option value="edit">Edit</option>
            <option value="delete">Delete</option>
          </select>
        </h1>
        <p className="muted">One thing at a time. Choose an option and fill the fields below.</p>
        <div className="divider"></div>

        <form className="stack" onSubmit={onSubmit}>
          <div className="grid">
            <div className="field">
              <label>Book ID (from organization)</label>
              <input className="input" name="org_id" value={form.org_id} onChange={onChange} required />
            </div>

            {mode !== 'get' && mode !== 'delete' && (
              <div className="field">
                <label>Book Name</label>
                <input className="input" name="name" value={form.name} onChange={onChange} disabled={mode==='edit' && editField!=='name'} required={mode==='add' || (mode==='edit' && editField==='name')} />
              </div>
            )}

            {mode !== 'get' && mode !== 'delete' && (
              <div className="field">
                <label>Author</label>
                <input className="input" name="author" value={form.author} onChange={onChange} disabled={mode==='edit' && editField!=='author'} required={mode==='add' || (mode==='edit' && editField==='author')} />
              </div>
            )}

            {mode !== 'get' && mode !== 'delete' && (
              <div className="field">
                <label>Year</label>
                <input className="input" name="year" type="number" value={form.year} onChange={onChange} disabled={mode==='edit' && editField!=='year'} required={mode==='add' || (mode==='edit' && editField==='year')} />
              </div>
            )}
          </div>

          {mode === 'edit' && (
            <div className="row">
              <span className="muted">Field to edit:</span>
              <select className="select" value={editField} onChange={e => setEditField(e.target.value)} style={{maxWidth:220}}>
                <option value="name">Name</option>
                <option value="author">Author</option>
                <option value="year">Year</option>
              </select>
            </div>
          )}

          <div className="row" style={{justifyContent:'flex-end'}}>
            <button className="btn" type="submit">{title}</button>
            <button className="btn secondary" type="button" onClick={() => { setMessage(null); setForm({ org_id:'', name:'', author:'', year:'' })}}>Reset</button>
          </div>
        </form>

        {message && (
          <div className={`msg ${message.type==='success'?'success':'error'}`} style={{marginTop:16}}>
            <div className="mono">{message.text}</div>
            {message.data && (
              <pre className="mono" style={{whiteSpace:'pre-wrap'}}>{JSON.stringify(message.data, null, 2)}</pre>
            )}
          </div>
        )}
      </div>
    </div>
  )
}