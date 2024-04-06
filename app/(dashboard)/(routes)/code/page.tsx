'use client'

import axios from 'axios'
import * as z from 'zod'
import Heading from '@/components/Heading'
import { Code, MessageSquare } from 'lucide-react'
import { useForm } from 'react-hook-form'
import Empty from '@/components/empty'

import { formSchema } from './constants'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { ChatCompletionMessageParam } from 'openai/resources/index.mjs'
import { useState } from 'react'
import Loader from '@/components/Loader'
import { cn } from '@/lib/utils'
import { UserAvatar } from '@/components/userAvatar'
import BotAvatar from '@/components/BotAvatar'
import ReactMarkdown from 'react-markdown'
import { useProModal } from '@/hooks/UseProModal'

const CodePage = () => {
  const proModal = useProModal()
  const router = useRouter()
  const [messages, setMessages] = useState<ChatCompletionMessageParam[]>([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
    },
  })

  const loading = form.formState.isSubmitting

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const userMessage: ChatCompletionMessageParam = {
        role: 'user',
        content: values.prompt,
      }
      const newMessages = [...messages, userMessage]
      const response = await axios.post('/api/code', {
        messages: newMessages,
      })

      console.log('response', response)

      setMessages((current) => [...current, userMessage, response.data])
      form.reset()
    } catch (error: any) {
      if (error?.response?.status === 403) {
        proModal.onOpen()
      }
    } finally {
      router.refresh()
    }
  }

  return (
    <div>
      <Heading
        title="Code Generation"
        description="Not going to take your job. Just generate the code you need."
        icon={Code}
        iconColor="text-green-700"
        bgColor="bg-green-700/10"
      />
      <div className="px-4 lg:px-8">
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
            >
              <FormField
                name="prompt"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                        disabled={loading}
                        placeholder="How do we center a div?"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                className="col-span-12 lg:col-span-2 w-full"
                disabled={loading}
              >
                Generate
              </Button>
            </form>
          </Form>
        </div>
        <div className="space-y-4 mt-4">
          {loading && (
            <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
              <Loader />
            </div>
          )}
          {messages.length === 0 && !loading && (
            <Empty label="No code generated." />
          )}
          <div className="flex flex-col-reverse gap-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  'p-8 w-full flex items-start gap-x-8 rounded-lg',
                  message.role === 'user'
                    ? 'bg-white border border-black/10'
                    : 'bg-muted'
                )}
              >
                {message.role === 'user' ? <UserAvatar /> : <BotAvatar />}
                <ReactMarkdown
                  components={{
                    pre: ({ node, ...props }) => (
                      <div className="overflow-auto w-full my-2 bg-black/10 p-10 rounded-lg">
                        <pre {...props} />
                      </div>
                    ),
                    code: ({ node, ...props }) => (
                      <code className="bg-black/10 rounded-lg p-1" {...props} />
                    ),
                  }}
                  className="text-sm overflow-hidden leading-7"
                >
                  {typeof message.content === 'string' ? message.content : ''}
                </ReactMarkdown>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CodePage
