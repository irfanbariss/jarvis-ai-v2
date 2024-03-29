'use client'

import { Zap } from 'lucide-react'
import { Button } from './ui/button'
import axios from 'axios'
import { useState } from 'react'

interface SubscriptionButtonProps {
  isPro: boolean
}

const SubscriptionButton = ({ isPro = false }: SubscriptionButtonProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const onClick = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get('/api/stripe')

      window.location.href = response.data.url
    } catch (err) {
      console.log('BILLING_ERROR', err)
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <Button variant={isPro ? 'default' : 'premium'} onClick={onClick}>
      {isPro ? 'Manage Subscription' : 'Upgrade'}
      {!isPro && <Zap className="w-4 h-4 ml-2" fill="white" />}
    </Button>
  )
}

export default SubscriptionButton
