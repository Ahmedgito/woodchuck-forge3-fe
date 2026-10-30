'use client'
import { Tooltip, Image } from 'antd'
import { useGenie } from '@/src/utils/context/genie-mode-context'
import React, { useState, useEffect } from 'react'
import { useTypingEffect } from '@/src/utils/hooks/useTypingAnimation'

type GeniePosition = 'top' | 'right' | 'bottom' | 'left'

interface GenieButtonWrapperProps {
  children: React.ReactNode
  hint: string
  position?: GeniePosition
  className?: string
}

export default function GenieButtonWrapper({
  children,
  hint,
  position = 'right',
  className,
}: GenieButtonWrapperProps) {
  const { genie, hints } = useGenie()
  const apiHint = hints?.[hint] ?? hint

  const [isOpen, setIsOpen] = useState(false)
  const [typingText, setTypingText] = useState('')
  const [showThinking, setShowThinking] = useState(false)
  //For hover effect
  const [hover, setHover] = useState(false)

  // trigger thinking then typing
  useEffect(() => {
    if (!isOpen) {
      setTypingText('')
      setShowThinking(false)
      return
    }

    // show "Thinking" for 1sec first
    setShowThinking(true)
    const thinkingTimeout = setTimeout(() => {
      setShowThinking(false)
      setTypingText(apiHint) // now pass text to hook
    }, 400)

    return () => clearTimeout(thinkingTimeout)
  }, [isOpen, apiHint])

  const typedText = useTypingEffect(typingText, 20)

  const getFlexDirection = () => {
    switch (position) {
      case 'top':
        return 'column-reverse'
      case 'bottom':
        return 'column'
      case 'left':
        return 'row-reverse'
      case 'right':
      default:
        return 'row'
    }
  }

  return (
    <div
      className={`${className??''} ${genie ? 'genie-show' : 'genie-hide'}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 20,
        position: 'relative',
        flexDirection: getFlexDirection(),
      }}
    >
      {children}

      
         <Tooltip
        title={
          showThinking ? (
            'Thinking…'
          ) : (
            <span
              style={{ whiteSpace: 'pre-line' }}
              dangerouslySetInnerHTML={{ __html: typedText || '&nbsp;' }}
            />
          )
        }
          placement={position}
          open={isOpen}
          onOpenChange={setIsOpen}
          overlayClassName='genie-tooltip'
        >
          <div
            className="genie-mode-main"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            <Image
              width={24}
              height={24}
              src={hover ? '/images/genie-hover.png' : '/images/genie.gif'}
              alt="Genie"
              preview={false}
              className="cursor-pointer"
            />
          </div>
        </Tooltip>
     
    </div>
  )
}
