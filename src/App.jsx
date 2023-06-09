import { useMemo, useRef, useState } from 'react'
import useLocalStorage from './hooks/useLocalStorage.js'

class TodoItemData {
  constructor(title, checked) {
    this.id = crypto.randomUUID()
    this.title = title
    this.checked = checked
    this.createDate = new Date().toLocaleString()
  }
}

function App() {
  const [searchKey, setSearchKey] = useState('')
  const [todos, setTodos] = useLocalStorage('TODOS', [
    new TodoItemData('Todo 1', false),
    new TodoItemData('Todo 2', true),
    new TodoItemData('Todo 3', false),
    new TodoItemData('不屈不挠，意思是不畏强暴，奋勇抗争，坚定不移，永不放弃。这个词通常用来描述那些在面对困难和挑战时坚持自己信念的人， 他们克服一切困难，不屈不挠地追求自己的目标。无论遇到多大的挑战，他们都能够坚持到底，不放弃，最终获得胜利。', false),
  ])
  const handleSearch = ({target}) => setSearchKey(target.value)
  const handleCheck = (id) => {
    const newTodos = todos.map((t) => t.id === id ? {...t, checked: !t.checked} : t)
    setTodos(newTodos)
  }
  const handleDelete = (id) => {
    if (!confirm(`确认删除这条记录?`)) return
    const newTodos = todos.filter((t) => t.id !== id)
    setTodos(newTodos)
  }
  const filteredTodos = useMemo(() => {
    return todos.filter(({title}) => title.toLowerCase().includes(searchKey.toLowerCase()))
      .map(({id, title, checked, createDate}) => {
        const listClassName = `${checked ? 'bg-gray-50 dark:bg-gray-900' : 'bg-white dark:bg-gray-800 shadow'} transition flex w-full flex-wrap items-center justify-between gap-2 rounded-xl px-4 py-2 leading-relaxed animate-rtl`

        return (<li key={id} className={listClassName}>
          <div className="break-words align-middle">
            <input type="checkbox"
                   className="mr-2 inline-block cursor-pointer rounded-full transition-all -translate-y-[1px] hover:scale-110"
                   title={title}
                   checked={checked} onChange={() => handleCheck(id)} />
            {title}
          </div>
          <span className="text-xs text-gray-500">{createDate}</span>
          <span className="flex-1"></span>
          <button onClick={() => handleDelete(id)} className="rounded-full transition-all hover:scale-125">🗑️</button>
        </li>)
      })
  }, [todos, searchKey])

  const [inputValue, setInputValue] = useState('')
  const addBtnDisabled = useMemo(
    () => inputValue.trim() === '',
    [inputValue],
  )
  const handleInput = ({target}) => {
    const val = target.value ?? ''
    setInputValue(val)
  }
  const scrollRef = useRef(null)
  const handleAdd = () => {
    setTodos([new TodoItemData(inputValue.trim(), false), ...todos])
    setInputValue('')
  }
  const handleKeyDown = ({shiftKey, keyCode}) => {
    if (shiftKey && keyCode === 13) handleAdd()
  }

  return (
    <main
      className="mx-auto flex h-screen w-screen justify-center overflow-hidden bg-white bg-opacity-60 p-4 text-gray-800 backdrop-blur dark:bg-gray-900 dark:bg-opacity-80 dark:text-gray-400">
      <div
        style={{gridTemplateRows: 'auto 1fr auto'}}
        className="grid h-full w-full max-w-4xl gap-4 rounded-xl bg-white bg-opacity-90 p-8 shadow-lg dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center gap-4 animate-ttb sm:flex-row sm:gap-8">
          <h1 className="text-3xl">待办事项</h1>
          <input type="text"
                 className="rounded-xl border-0 bg-white text-sm shadow-inner transition-all dark:bg-gray-800"
                 placeholder="搜索待办事项..." value={searchKey} onInput={handleSearch}
          />
        </div>
        <ul ref={scrollRef}
            className="my-4 flex max-h-full w-full flex-col items-center gap-3 overflow-x-hidden overflow-y-scroll p-2 hide-scrollbar">
          {filteredTodos}
        </ul>
        <div className="flex w-full flex-col items-end gap-3 animate-btt">
          <textarea value={inputValue} onInput={handleInput} onKeyDown={handleKeyDown}
                    placeholder="添加待办事项..." rows="3"
                    className="w-full rounded-xl border-0 bg-white text-sm shadow-inner transition-all dark:bg-gray-800" />
          <button onClick={handleAdd} disabled={addBtnDisabled} type="submit"
                  className="rounded-full bg-white px-3 shadow transition py-1.5 hover:shadow active:scale-95 active:bg-sky-100 disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none dark:bg-gray-800">
            ➕ 添加
          </button>
        </div>
      </div>
    </main>
  )
}

export default App
