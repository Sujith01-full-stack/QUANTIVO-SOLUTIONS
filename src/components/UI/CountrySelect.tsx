import { useState, useCallback, useEffect, useRef, FocusEvent, KeyboardEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ChevronDown } from 'lucide-react'
import { countries, Country } from '../../services/countries'

interface CountrySelectProps {
  value: string
  dialCode: string
  onChange: (value: { code: string; name: string; flag: string; dialCode: string }) => void
  label?: string
  id?: string
  required?: boolean
  disabled?: boolean
}

export default function CountrySelect({
  value,
  dialCode,
  onChange,
  label = 'Country',
  id = 'country',
  required = false,
  disabled = false,
}: CountrySelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const [touched, setTouched] = useState(false)

  const triggerRef = useRef<HTMLButtonElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const normalisedOptions = useCallback(() => {
    const seen = new Set<string>()
    return countries.filter(c => {
      if (seen.has(c.code)) return false
      seen.add(c.code)
      return true
    })
  }, [])

  const allOptions = normalisedOptions()

  const selectedCountry = allOptions.find(c => c.code === value || c.dialCode === dialCode)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        isOpen &&
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node) &&
        listRef.current &&
        !listRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  const filteredOptions = allOptions.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.dialCode.includes(searchQuery),
  )

  const handleSelect = useCallback(
    (country: Country) => {
      setSearchQuery('')
      setHighlightedIndex(-1)
      setIsOpen(false)
      onChange(country)
    },
    [onChange],
  )

  const handleTriggerClick = () => {
    if (disabled) return
    setIsOpen(!isOpen)
    if (!isOpen) {
      setSearchQuery('')
      setHighlightedIndex(-1)
      inputRef.current?.focus()
    }
  }

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
          e.preventDefault()
          setIsOpen(true)
          inputRef.current?.focus()
        }
        return
      }

      if (e.key === 'Escape') {
        e.preventDefault()
        setIsOpen(false)
        triggerRef.current?.focus()
        return
      }

      if (e.key === 'Enter') {
        e.preventDefault()
        if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
          handleSelect(filteredOptions[highlightedIndex])
        }
        return
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setHighlightedIndex(prev => (prev >= filteredOptions.length - 1 ? 0 : prev + 1))
        return
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setHighlightedIndex(prev => (prev <= 0 ? filteredOptions.length - 1 : prev - 1))
        return
      }
    },
    [isOpen, filteredOptions, handleSelect],
  )

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setHighlightedIndex(-1)
  }

  const handleBlur = (e: FocusEvent) => {
    if (
      e.currentTarget.contains(e.relatedTarget as Node) ||
      (listRef.current && listRef.current.contains(e.relatedTarget as Node))
    ) {
      return
    }
    setTouched(true)
    setIsOpen(false)
  }

  const isError = touched && required && !value

  return (
    <div className="country-select-wrapper" ref={wrapperRef}>
      <label htmlFor={id} className="country-select-label">
        {label}
      </label>

      <button
        ref={triggerRef}
        id={`${id}-trigger`}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={label}
        onClick={handleTriggerClick}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className={`country-select-trigger ${isOpen ? 'trigger-open' : ''} ${
          disabled ? 'trigger-disabled' : ''
        } ${isError ? 'trigger-error' : ''}`}
      >
        <span className="trigger-value">
          {selectedCountry ? (
            <span className="trigger-selected">
              <span className="country-flag">{selectedCountry.flag}</span>
              <span className="country-name">{selectedCountry.name}</span>
              <span className="country-dial-code">{selectedCountry.dialCode}</span>
            </span>
          ) : (
            <span className="trigger-placeholder">Select a country</span>
          )}
        </span>
        <ChevronDown size={16} className={`trigger-arrow ${isOpen ? 'arrow-open' : ''}`} />
      </button>

      {isError && <p className="country-select-error">Please select a country.</p>}

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            ref={listRef}
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 'auto' }}
            className="country-select-list"
            style={{ maxHeight: 300 }}
          >
            <div className="country-select-search-wrap">
              <Search size={14} className="country-select-search-icon" />
              <input
                ref={inputRef}
                id={`${id}-search`}
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                autoComplete="off"
                spellCheck={false}
                placeholder="Search countries..."
                className="country-select-search-input"
              />
            </div>

            {filteredOptions.length > 0 ? (
              filteredOptions.map((country, idx) => {
                const isHighlighted = highlightedIndex === idx
                return (
                  <motion.li
                    key={country.code}
                    whileHover={{ background: 'var(--bg-secondary)' }}
                    onClick={() => handleSelect(country)}
                    onMouseMove={() => setHighlightedIndex(idx)}
                    className={`country-option ${isHighlighted ? 'option-highlighted' : ''}`}
                  >
                    <span className="country-flag">{country.flag}</span>
                    <span className="country-name">{country.name}</span>
                    <span className="country-dial-code">{country.dialCode}</span>
                  </motion.li>
                )
              })
            ) : (
              <li className="country-select-empty">No countries found</li>
            )}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}
