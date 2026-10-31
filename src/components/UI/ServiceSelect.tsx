import { useState, useCallback, useEffect, useRef, FocusEvent, KeyboardEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Plus, ChevronDown, X } from 'lucide-react'

interface ServiceSelectProps {
  value: string
  onChange: (value: string) => void
  options: string[]
  label?: string
  id?: string
  required?: boolean
  disabled?: boolean
}

/**
 * Searchable and creatable dropdown for the "Service Interested In" field.
 *
 * Behaviour:
 * - Click to open, shows all options.
 * - Search input filters options as you type.
 * - Typing text that does not match an option shows `+ Add "Typed Text"`.
 * - Selecting "Other" reveals an extra text input for a custom service name.
 * - Keyboard: Enter selects, Escape closes, ArrowUp/ArrowDown navigate.
 * - Prevents duplicate entries.
 */
export default function ServiceSelect({
  value,
  onChange,
  options,
  label = 'Service Interested In',
  id = 'service',
  required = false,
  disabled = false,
}: ServiceSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [customInput, setCustomInput] = useState('')
  const [showCustomInput, setShowCustomInput] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const [touched, setTouched] = useState(false)

  const triggerRef = useRef<HTMLButtonElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const customTextRef = useRef<HTMLInputElement>(null)

  // Normalise options: keep existing order, deduplicate, strip blanks
  const normalisedOptions = useCallback(() => {
    const seen = new Set<string>()
    return options.filter(opt => {
      const trimmed = opt.trim()
      if (!trimmed || seen.has(trimmed)) return false
      seen.add(trimmed)
      return true
    })
  }, [options])

  const allOptions = normalisedOptions()

  const isCustom = useCallback(
    (val: string) => !allOptions.includes(val) && val.trim().length > 0,
    [allOptions],
  )

  // When value is "Other", show the custom text input
  useEffect(() => {
    setShowCustomInput(value === 'Other')
    if (value !== 'Other') {
      setCustomInput('')
    }
  }, [value])

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

  const filteredOptions = allOptions.filter(opt =>
    opt.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const hasExactMatch = filteredOptions.some(
    opt => opt.toLowerCase() === searchQuery.toLowerCase(),
  )

  const showAddOption =
    searchQuery.trim().length > 0 && !hasExactMatch && !isCustom(searchQuery)

  const handleSelect = useCallback(
    (opt: string) => {
      setSearchQuery('')
      setHighlightedIndex(-1)
      setIsOpen(false)
      onChange(opt)
    },
    [onChange],
  )

  const handleAddCustom = useCallback(() => {
    const name = searchQuery.trim()
    if (!name || isCustom(name)) return
    handleSelect(name)
  }, [searchQuery, isCustom, handleSelect])

  const handleCustomInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomInput(e.target.value)
  }

  const handleConfirmCustom = useCallback(() => {
    const name = customInput.trim()
    if (!name || isCustom(name)) return
    setShowCustomInput(false)
    setCustomInput('')
    setIsOpen(false)
    onChange(name)
  }, [customInput, isCustom, onChange])

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
        if (showAddOption) {
          handleAddCustom()
        } else if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
          handleSelect(filteredOptions[highlightedIndex])
        }
        return
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setHighlightedIndex(prev =>
          prev >= filteredOptions.length - 1 ? 0 : prev + 1,
        )
        return
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setHighlightedIndex(prev => (prev <= 0 ? filteredOptions.length - 1 : prev - 1))
        return
      }
    },
    [isOpen, filteredOptions, showAddOption, handleAddCustom, handleSelect],
  )

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setHighlightedIndex(-1)
  }

  const handleBlur = (e: FocusEvent) => {
    // Allow blur to move focus within the dropdown without closing
    if (
      e.currentTarget.contains(e.relatedTarget as Node) ||
      (listRef.current && listRef.current.contains(e.relatedTarget as Node))
    ) {
      return
    }
    setTouched(true)
    setIsOpen(false)
  }

  const optionItems = [
    ...filteredOptions,
    ...(showAddOption ? [`+ Add "${searchQuery.trim()}"`] : []),
  ]

  const isError = touched && required && !value

  return (
    <div className="service-select-wrapper" ref={wrapperRef}>
      <label htmlFor={id} className="service-select-label">
        {label}
      </label>

      {/* Trigger / selected value display */}
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
        className={`service-select-trigger ${isOpen ? 'trigger-open' : ''} ${
          disabled ? 'trigger-disabled' : ''
        } ${isError ? 'trigger-error' : ''}`}
      >
        <span className="trigger-value">
          {value ? (
            <>
              <span className="trigger-text">{value}</span>
              {value === 'Other' && customInput ? (
                <span className="trigger-custom">({customInput})</span>
              ) : null}
            </>
          ) : (
            <span className="trigger-placeholder">Select a service</span>
          )}
          {showAddOption && searchQuery.trim() && (
            <span className="trigger-add">+ Add "{searchQuery.trim()}"</span>
          )}
        </span>
        <ChevronDown size={16} className={`trigger-arrow ${isOpen ? 'arrow-open' : ''}`} />
      </button>

      {/* Error message */}
      {isError && <p className="service-select-error">Please select a service.</p>}

      {/* Dropdown list */}
      <AnimatePresence>
        {isOpen && (
          <motion.ul
            ref={listRef}
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="service-select-list"
            style={{ maxHeight: 300 }}
          >
            {/* Search input inside dropdown */}
            <div className="service-select-search-wrap">
              <Search size={14} className="service-select-search-icon" />
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
                placeholder="Search services..."
                className="service-select-search-input"
              />
            </div>

            {optionItems.length > 0 ? (
              optionItems.map((opt, idx) => {
                const isAdd = opt.startsWith('+ Add "')
                const displayLabel = isAdd
                  ? opt.replace(/^\+\s*Add\s*"(.*)"$/, '$1')
                  : opt
                const isHighlighted = highlightedIndex === idx
                return (
                  <motion.li
                    key={opt}
                    whileHover={{
                      background: isAdd ? 'rgba(255, 106, 0, 0.08)' : 'var(--bg-secondary)',
                    }}
                    onClick={() => (isAdd ? handleAddCustom() : handleSelect(opt))}
                    onMouseMove={() => setHighlightedIndex(idx)}
                    className={`service-select-option ${isHighlighted ? 'option-highlighted' : ''} ${
                      isAdd ? 'option-add' : ''
                    }`}
                  >
                    {isAdd && <Plus size={14} className="option-plus" />}
                    <span className="option-label">{displayLabel}</span>
                  </motion.li>
                )
              })
            ) : (
              <li className="service-select-empty">No services found</li>
            )}
          </motion.ul>
        )}
      </AnimatePresence>

      {/* "Other" custom text input */}
      {showCustomInput && !disabled && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="service-select-custom-wrap"
        >
          <div className="service-select-custom-header">
            <X size={14} className="custom-x" />
            <span className="custom-title">Enter a custom service name</span>
          </div>
          <input
            ref={customTextRef}
            id={`${id}-custom`}
            type="text"
            value={customInput}
            onChange={handleCustomInputChange}
            onBlur={handleBlur}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleConfirmCustom()
              }
            }}
            placeholder="Enter your service name..."
            className="service-select-custom-input"
          />
          <div className="service-select-custom-actions">
            <button
              type="button"
              onClick={() => {
                setShowCustomInput(false)
                setCustomInput('')
                setIsOpen(false)
              }}
              className="service-select-custom-cancel"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmCustom}
              disabled={!customInput.trim() || isCustom(customInput)}
              className={`service-select-custom-add ${
                !customInput.trim() || isCustom(customInput) ? 'add-disabled' : ''
              }`}
            >
              Add
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}
