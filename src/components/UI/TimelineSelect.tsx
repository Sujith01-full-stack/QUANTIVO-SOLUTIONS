import { useState, useCallback, useEffect, useRef, FocusEvent, KeyboardEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Plus, ChevronDown, X } from 'lucide-react'

interface TimelineSelectProps {
  value: string
  onChange: (value: string) => void
  options: string[]
  label?: string
  id?: string
  required?: boolean
  disabled?: boolean
}

/**
 * Searchable and creatable dropdown for the "Project Timeline" field.
 *
 * Behaviour:
 * - Click to open, shows all timeline options.
 * - Search input filters options as you type.
 * - Typing text that does not match an option shows `+ Add Custom Timeline`.
 * - Selecting "Enter Custom Timeline" reveals a text input for custom timeline.
 * - Keyboard: Enter selects, Escape closes, ArrowUp/ArrowDown navigate.
 * - Prevents duplicate entries.
 */
export default function TimelineSelect({
  value,
  onChange,
  options,
  label = 'Project Timeline',
  id = 'timeline',
  required = false,
  disabled = false,
}: TimelineSelectProps) {
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

  // When value is "Enter Custom Timeline", show the custom text input
  useEffect(() => {
    setShowCustomInput(value === 'Enter Custom Timeline')
    if (value !== 'Enter Custom Timeline') {
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
    // Only allow text input (no special characters that could break form submission)
    const rawValue = e.target.value
    const filtered = rawValue.replace(/[<>]/g, '')
    setCustomInput(filtered)
  }

  const handleConfirmCustom = useCallback(() => {
    const name = customInput.trim()
    if (!name) return
    setShowCustomInput(false)
    setCustomInput('')
    setIsOpen(false)
    onChange(name)
  }, [customInput, onChange])

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
    ...(showAddOption ? [`+ Add Custom Timeline: "${searchQuery.trim()}"`] : []),
    'Enter Custom Timeline',
  ]

  const isError = touched && required && !value

  return (
    <div className="timeline-select-wrapper" ref={wrapperRef}>
      <label htmlFor={id} className="timeline-select-label">
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
        className={`timeline-select-trigger ${isOpen ? 'trigger-open' : ''} ${
          disabled ? 'trigger-disabled' : ''
        } ${isError ? 'trigger-error' : ''}`}
      >
        <span className="trigger-value">
          {value ? (
            <>
              <span className="trigger-text">{value}</span>
            </>
          ) : (
            <span className="trigger-placeholder">Select a timeline</span>
          )}
          {showAddOption && searchQuery.trim() && (
            <span className="trigger-add">+ Add Custom Timeline</span>
          )}
        </span>
        <ChevronDown size={16} className={`trigger-arrow ${isOpen ? 'arrow-open' : ''}`} />
      </button>

      {/* Error message */}
      {isError && <p className="timeline-select-error">Please select or enter a timeline.</p>}

      {/* Dropdown list */}
      <AnimatePresence>
        {isOpen && (
          <motion.ul
            ref={listRef}
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 'auto' }}
            className="timeline-select-list"
            style={{ maxHeight: 300 }}
          >
            {/* Search input inside dropdown */}
            <div className="timeline-select-search-wrap">
              <Search size={14} className="timeline-select-search-icon" />
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
                placeholder="Search timelines..."
                className="timeline-select-search-input"
              />
            </div>

            {optionItems.length > 0 ? (
              optionItems.map((opt, idx) => {
                const isAdd = opt.startsWith('+ Add Custom Timeline')
                const isCustomOpt = opt === 'Enter Custom Timeline'
                const displayLabel = isAdd
                  ? opt.replace(/^\+ Add Custom Timeline:\s*"(.*)"$/, '$1')
                  : opt
                const isHighlighted = highlightedIndex === idx
                return (
                  <motion.li
                    key={opt}
                    whileHover={{
                      background: isAdd || isCustomOpt
                        ? 'rgba(255, 106, 0, 0.08)'
                        : 'var(--bg-secondary)',
                    }}
                    onClick={() => {
                      if (isAdd) {
                        handleAddCustom()
                      } else if (isCustomOpt) {
                        setShowCustomInput(true)
                        setIsOpen(false)
                      } else {
                        handleSelect(opt)
                      }
                    }}
                    onMouseMove={() => setHighlightedIndex(idx)}
                    className={`timeline-select-option ${isHighlighted ? 'option-highlighted' : ''} ${
                      isAdd || isCustomOpt ? 'option-add' : ''
                    }`}
                  >
                    {isAdd && <Plus size={14} className="option-plus" />}
                    {isCustomOpt && <Plus size={14} className="option-custom" />}
                    <span className="option-label">{displayLabel}</span>
                  </motion.li>
                )
              })
            ) : (
              <li className="timeline-select-empty">No timelines found</li>
            )}
          </motion.ul>
        )}
      </AnimatePresence>

      {/* Custom timeline input */}
      {showCustomInput && !disabled && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="timeline-select-custom-wrap"
        >
          <div className="timeline-select-custom-header">
            <X size={14} className="custom-x" />
            <span className="custom-title">Enter Custom Timeline</span>
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
            placeholder="Enter your timeline (e.g., 2 weeks, 18 months)"
            className="timeline-select-custom-input"
          />
          <div className="timeline-select-custom-hint">
            Accepts text values only (e.g., Within 15 Days, 2 Weeks, 18 Months)
          </div>
          <div className="timeline-select-custom-actions">
            <button
              type="button"
              onClick={() => {
                setShowCustomInput(false)
                setCustomInput('')
                setIsOpen(false)
              }}
              className="timeline-select-custom-cancel"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmCustom}
              disabled={!customInput.trim()}
              className={`timeline-select-custom-add ${
                !customInput.trim() ? 'add-disabled' : ''
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
