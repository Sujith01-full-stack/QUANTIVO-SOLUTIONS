import { useState, useCallback, useEffect, useRef, FocusEvent, KeyboardEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Plus, ChevronDown, X } from 'lucide-react'

interface BudgetSelectProps {
  value: string
  onChange: (value: string) => void
  options: string[]
  label?: string
  id?: string
  required?: boolean
  disabled?: boolean
}

/**
 * Searchable and creatable dropdown for the "Project Budget" field.
 *
 * Behaviour:
 * - Click to open, shows all budget options.
 * - Search input filters options as you type.
 * - Typing text that does not match an option shows `+ Add Custom Budget`.
 * - Selecting "Enter Custom Budget" reveals a numeric input for ₹ amounts.
 * - Keyboard: Enter selects, Escape closes, ArrowUp/ArrowDown navigate.
 * - Prevents duplicate entries.
 */
export default function BudgetSelect({
  value,
  onChange,
  options,
  label = 'Project Budget',
  id = 'budget',
  required = false,
  disabled = false,
}: BudgetSelectProps) {
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

  // When value is "Enter Custom Budget", show the custom text input
  useEffect(() => {
    setShowCustomInput(value === 'Enter Custom Budget')
    if (value !== 'Enter Custom Budget') {
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

  // Validate custom budget input: numeric only, optional ₹ prefix, no negatives
  const isValidCustomAmount = useCallback(
    (val: string) => {
      const trimmed = val.trim()
      if (!trimmed) return false
      // Allow optional ₹ prefix, then digits with optional commas and decimal
      const clean = trimmed.replace(/^₹\s*/, '')
      return /^[1-9]\d{0,2}(,\d{3})*(\.\d+)?$|^\d+(\.\d+)?$/.test(clean)
    },
    [],
  )

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
    // Only allow digits, commas, periods, and ₹ symbol
    const rawValue = e.target.value
    const filtered = rawValue.replace(/[^₹\d.,]/g, '')
    setCustomInput(filtered)
  }

  const handleConfirmCustom = useCallback(() => {
    const name = customInput.trim()
    if (!name || !isValidCustomAmount(name)) return
    // Normalize: add ₹ prefix if not present
    const normalized = name.startsWith('₹') ? name : `₹${name}`
    setShowCustomInput(false)
    setCustomInput('')
    setIsOpen(false)
    onChange(normalized)
  }, [customInput, isValidCustomAmount, onChange])

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
    ...(showAddOption ? [`+ Add Custom Budget: "${searchQuery.trim()}"`] : []),
    'Enter Custom Budget',
  ]

  const isError = touched && required && !value

  return (
    <div className="budget-select-wrapper" ref={wrapperRef}>
      <label htmlFor={id} className="budget-select-label">
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
        className={`budget-select-trigger ${isOpen ? 'trigger-open' : ''} ${
          disabled ? 'trigger-disabled' : ''
        } ${isError ? 'trigger-error' : ''}`}
      >
        <span className="trigger-value">
          {value ? (
            <>
              <span className="trigger-text">{value}</span>
            </>
          ) : (
            <span className="trigger-placeholder">Select a budget</span>
          )}
          {showAddOption && searchQuery.trim() && (
            <span className="trigger-add">+ Add Custom Budget</span>
          )}
        </span>
        <ChevronDown size={16} className={`trigger-arrow ${isOpen ? 'arrow-open' : ''}`} />
      </button>

      {/* Error message */}
      {isError && <p className="budget-select-error">Please select or enter a budget.</p>}

      {/* Dropdown list */}
      <AnimatePresence>
        {isOpen && (
          <motion.ul
            ref={listRef}
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 'auto' }}
            className="budget-select-list"
            style={{ maxHeight: 300 }}
          >
            {/* Search input inside dropdown */}
            <div className="budget-select-search-wrap">
              <Search size={14} className="budget-select-search-icon" />
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
                placeholder="Search budgets..."
                className="budget-select-search-input"
              />
            </div>

            {optionItems.length > 0 ? (
              optionItems.map((opt, idx) => {
                const isAdd = opt.startsWith('+ Add Custom Budget')
                const isCustomOpt = opt === 'Enter Custom Budget'
                const displayLabel = isAdd
                  ? opt.replace(/^\+ Add Custom Budget:\s*"(.*)"$/, '$1')
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
                    className={`budget-select-option ${isHighlighted ? 'option-highlighted' : ''} ${
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
              <li className="budget-select-empty">No budgets found</li>
            )}
          </motion.ul>
        )}
      </AnimatePresence>

      {/* Custom budget amount input */}
      {showCustomInput && !disabled && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="budget-select-custom-wrap"
        >
          <div className="budget-select-custom-header">
            <X size={14} className="custom-x" />
            <span className="custom-title">Enter Custom Budget</span>
          </div>
          <div className="budget-select-custom-prefix">
            <span className="currency-symbol">₹</span>
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
              placeholder="Enter your budget in INR (₹)"
              className="budget-select-custom-input"
            />
          </div>
          <div className="budget-select-custom-hint">
            Accept numeric values only (e.g., 75000 → ₹75,000 or 150000 → ₹1,50,000)
          </div>
          <div className="budget-select-custom-actions">
            <button
              type="button"
              onClick={() => {
                setShowCustomInput(false)
                setCustomInput('')
                setIsOpen(false)
              }}
              className="budget-select-custom-cancel"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmCustom}
              disabled={!customInput.trim() || !isValidCustomAmount(customInput)}
              className={`budget-select-custom-add ${
                !customInput.trim() || !isValidCustomAmount(customInput)
                  ? 'add-disabled'
                  : ''
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
