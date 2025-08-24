import React, { useEffect, useRef, useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { API } from 'aws-amplify'
import { useAppContext } from '@/lib/contextLib'
import { onError } from '@/lib/errorLib'
import { SquarePen } from 'lucide-react'
import type { PostType } from '@/types/post'
import { s3Upload } from '@/lib/awsLib'

function EditPost({ author, pk, userId }: PostType) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  // const [postList, setPostList] = useState<PostType[]>([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [type, setType] = useState('')
  const [attachmentUrl, setAttachmentUrl] = useState<string | undefined>()
  const fileInput = useRef<File>(null)

  const { isAuthenticated } = useAppContext()

  // Fetch all posts
  // async function loadPosts(): Promise<PostType[]> {
  //   return API.get('posts', '/posts', {})
  // }

  // Put update
  async function updatePost(note: PostType) {
    return API.put('posts', `/posts/${pk}`, { body: note })
  }

  // Find the one post in the list
  

  // When the dialog opens (isAuthenticated), load and seed form state
  useEffect(() => {
    if (!isAuthenticated) return
    
    // function findCurrentPost(data: PostType[], pk: string) {
    //   return data.find(
    //     p =>
    //       p?.entityType === 'POST' &&
    //       p?.pk?.includes(pk!) &&
    //       p?.author?.includes(author)
    //   )
    // }

    async function onLoad() {
      if(isAuthenticated){
        try {
        
            // const all = await loadPosts()
            // setPostList(all)

            // const current = findCurrentPost(all, pk!)
            
            // if (current) {
            //   setTitle(current.title || '')
            //   setContent(current.content || '')
            //   setAttachmentUrl(current.attachment)
            // }
          
        } catch (e) {
          onError(e)
        }
      }
    }

    onLoad()
  }, [author, isAuthenticated, pk])

  // Handle file select
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files?.[0]) {
      fileInput.current = e.target.files[0]
      // show preview immediately
      setAttachmentUrl(URL.createObjectURL(e.target.files[0]))
    }
  }

  // Submit update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const uploaded = fileInput.current
        ? await s3Upload(fileInput.current)
        : attachmentUrl

      await updatePost({
        pk,
        sk: `DETAILS#POST#${pk}`,
        author,
        userId,
        title,
        content,
        attachment: uploaded,
        entityType: 'POST',
        createdAt: Date.now(),
      })

    setOpen(false)
    location.reload();
    } catch (err) {
      onError(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="rounded-full">
          <SquarePen className="w-5 h-5 text-pink-500" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Your Post</DialogTitle>
          <DialogDescription>
            Update the title, description, type, or attachment below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-600"
          />

          <Input
            placeholder="Post Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />

          <Textarea
            placeholder="Post Content"
            value={content}
            onChange={e => setContent(e.target.value)}
            required
          />

          <Input
            placeholder="Type (e.g. article, tutorial)"
            value={type}
            onChange={e => setType(e.target.value)}
          />
          
          {attachmentUrl && (
            <img
              src={attachmentUrl}
              alt="Attachment preview"
              className="mt-2 rounded shadow-sm max-h-48 object-contain"
            />
          )}

          <DialogFooter>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Updating…' : 'Update Post'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
    </>
  )
}

export default EditPost
