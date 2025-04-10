import AreYouSureAlert from '@/components/AreYouSureAlert'
import DataTable from '@/components/DataTable'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { useAutosizeTextArea } from '@/hooks/use-autoresize'
import { getAllGroups, getEmployee, getGlobalMessages, sendMessage } from '@/lib/api/api'
import { useAuth } from '@/lib/api/AuthProvider'
import { getMonogram } from '@/lib/utils'
import { format } from 'date-fns'
import { hu } from 'date-fns/locale'
import { ArrowDown, ArrowUp, ArrowUpDown, Group, LoaderCircle, Plus, Search, SendHorizonal, Users } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'

export default function Inbox() {
  const auth = useAuth()
  const params = useParams();

  const [resizeTrigger, setResizeTrigger] = useState(0);
  const [scrollBottomTrigger, setScrollBottomTrigger] = useState(0);

  const [messages, setMessages] = useState([])
  const [employees, setEmployees] = useState([])

  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  function handleLoadMore() {
    if (loading || !hasMore) return;
    setLoading(true);
    (params.id ? async()=>{/*TODO*/} : getGlobalMessages)(auth.token, page, params.id)
    .then(data => {
      if (data.data.messages.length === 0) setHasMore(false);
      else setPage((o) => o+1);
      setMessages((o) => [...o, ...data.data.messages]);
    })
    .catch(() => toast.error('Hiba történt az üzenetek betöltése közben!'))
    .finally(() => setLoading(false))
  }

  useEffect(() => {
    setPage(1);
    setMessages([]);
    setEmployees([]);
    setLoading(false);
    setHasMore(true);
    handleLoadMore();
    setTimeout(() => setScrollBottomTrigger(new Date().getTime()), 20);
  }, [params.id]);

  useEffect(() => {
    if (!messages) return;
    const eids = new Set();
    messages.forEach(s => eids.add(s.author));
    if (eids.size !== 0)
      getEmployee(auth.token, Array.from(eids))
      .then(data => setEmployees(data.data.employees))
    else
      setEmployees([]);
  }, [messages]);

  const scrollAreaTop = useRef()
  // useEffect(() => {
  //   if (!scrollAreaTop.current) return;
  //   const observer = new IntersectionObserver((entries) => {
  //     if (entries[0].isIntersecting) handleLoadMore()
  //   }, {threshold: 1});
  //   observer.observe(scrollAreaTop.current);
  //   return observer.disconnect;
  // }, [scrollAreaTop])

  const scrollAreaBottom = useRef()
  useEffect(() => {
    scrollAreaBottom.current.scrollIntoView({behavior: 'smooth'});
  }, [scrollAreaBottom, scrollBottomTrigger])

  const messageInputRef = useRef()
  useAutosizeTextArea({
    textAreaRef: messageInputRef,
    triggerAutoSize: resizeTrigger,
    maxHeight: 112,
  })
  function messageKeydown(e) {
    setTimeout(() => setResizeTrigger(new Date().getTime()), 20);
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage({preventDefault: e.preventDefault, target: e.target.form});
    }
  }

  function handleSendMessage(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const text = formData.get('text');
    // const author = auth.user.id;
    const recipient = params.id || undefined;
    if (!text.trim()) {
      toast.error('Az üzenet nem lehet üres');
      return;
    }
    sendMessage(auth.token, text, recipient)
    .then((v) => {
      setMessages((o) => [v.data.message, ...o]);
      setScrollBottomTrigger(new Date().getTime());
      e.target.reset();
    })
    .catch(() => toast.error('Hiba történt az üzenet küldése közben'))
  }
  
  return (
    <div className='max-w-screen-2xl md:w-full mx-auto p-4 flex gap-6 max-h-screen'>
      <Card className='w-80 p-4 gap-4 flex flex-col'>
        <form className='flex gap-2'>
          <Input placeholder='Keresés...' />
          <Button type='submit' variant="outline" size='icon' className="aspect-square"><Search /></Button>
        </form>
        <Separator />
        <ScrollArea className='flex flex-col gap-4'>
          <Button variant="ghost" className='flex py-4 px-2 w-full gap-4 h-auto justify-start'>
            <Avatar>
              <AvatarImage src="null" />
              <AvatarFallback><Users /></AvatarFallback>
            </Avatar>
            <div>
              <p className='text-start font-bold'>Üzenőfal</p>
              <p className='text-start text-sm opacity-70'>12:34 • Lorem ipsum dolor sit...</p>
            </div>
          </Button>
          {new Array(10).fill(1).map((_, i) => (
            <Button key={i} variant="ghost" className='flex py-4 px-2 w-full gap-4 h-auto justify-start'>
              <Avatar>
                <AvatarImage src="https://uploads.dailydot.com/2024/07/wet-owl-1.jpg?auto=compress&fm=pjpg" />
                <AvatarFallback>${getMonogram("Legfőbb Ügyész")}</AvatarFallback>
              </Avatar>
              <div>
                <p className='text-start font-bold'>Legfőbb Ügyész</p>
                <p className='text-start text-sm opacity-70'>12:34 • Lorem ipsum dolor sit...</p>
              </div>
            </Button>
          ))}
        </ScrollArea>
      </Card>
      <Card className='p-4 flex-1 flex flex-col'>
        <ScrollArea className='flex-1 mb-4'>
          {hasMore && (
            <div ref={scrollAreaTop} className="flex justify-center">
              <Button variant="outline" onClick={handleLoadMore}>Továbbiak betöltése</Button>
            </div>
          )}
          <div className='flex flex-col'>
          {messages?.slice().reverse().map((message, i, arr) => message.author == auth.user.id ? (
            <div key={message.id} className='flex ml-auto w-3/4 justify-end mt-6'>
              <p className='bg-primary text-primary-foreground text-right p-2 rounded hyphens-auto break-all whitespace-pre-wrap'>
                {message.text}
              </p>
            </div>
            ) : arr[i-1] && arr[i-1].author == message.author && new Date(message.created).getTime() - new Date(arr[i-1].created).getTime() < 600000 ? (
              <div key={message.id} className='flex w-3/4 mt-2'>
                <p className='ml-14 bg-secondary p-2 rounded hyphens-auto break-all whitespace-pre-wrap'>
                  {message.text}
                </p>
              </div>
            ) : (
              <div key={message.id} className='flex gap-4 w-3/4 mt-6'>
                <Avatar>
                  <AvatarImage src="https://uploads.dailydot.com/2024/07/wet-owl-1.jpg?auto=compress&fm=pjpg" />
                  <AvatarFallback>${getMonogram(employees.find((v) => v.id == message.author)?.name || "")}</AvatarFallback>
                </Avatar>
                <div className='flex flex-col gap-2'>
                  <p>
                    <span className='font-bold'>{employees.find((v) => v.id == message.author)?.name || <LoaderCircle className='animate-spin inline' />}</span>
                    <span className='px-4'>•</span>
                    <span>{format(message.created, "P p", {locale:hu})}</span>
                  </p>
                  <p className='bg-secondary p-2 rounded hyphens-auto break-all whitespace-pre-wrap'>
                    {message.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className='h-px w-px' ref={scrollAreaBottom}></div>
        </ScrollArea>
        <form className='flex gap-4' onSubmit={handleSendMessage}>
          <Textarea name="text" placeholder="Üzenet" className="h-10 min-h-10 max-h-28"
          onKeyDown={messageKeydown} ref={messageInputRef} />
          <Button className="ml-auto" variant="outline" size="icon"><SendHorizonal /></Button>
        </form>
      </Card>
    </div>
  )
}
