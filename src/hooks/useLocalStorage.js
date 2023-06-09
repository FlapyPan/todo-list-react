import { useEffect, useState } from 'react'

export default (storageKey, fallbackState) => {
  const [value, setValue] = useState(JSON.parse(localStorage.getItem(storageKey)) ?? fallbackState)
  useEffect(() => localStorage.setItem(storageKey, JSON.stringify(value)), [value, storageKey])
  return [value, setValue]
}
