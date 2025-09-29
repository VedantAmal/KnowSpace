"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Plus, Type, List, Code, Quote, CheckSquare, Trash2, GripVertical, Hash } from "lucide-react"

interface Block {
  id: string
  type: "heading" | "paragraph" | "list" | "code" | "image" | "quote" | "checklist"
  content: any
}

interface BlockEditorProps {
  content: Block[]
  onChange: (content: Block[]) => void
  placeholder?: string
}

export function BlockEditor({ content, onChange, placeholder }: BlockEditorProps) {
  const [showBlockMenu, setShowBlockMenu] = useState<string | null>(null)

  const generateId = () => Math.random().toString(36).substr(2, 9)

  const addBlock = (type: Block["type"], afterId?: string) => {
    const newBlock: Block = {
      id: generateId(),
      type,
      content: getDefaultContent(type),
    }

    if (afterId) {
      const index = content.findIndex((block) => block.id === afterId)
      const newContent = [...content]
      newContent.splice(index + 1, 0, newBlock)
      onChange(newContent)
    } else {
      onChange([...content, newBlock])
    }

    setShowBlockMenu(null)
  }

  const getDefaultContent = (type: Block["type"]) => {
    switch (type) {
      case "heading":
        return { level: 1, text: "" }
      case "paragraph":
        return { text: "" }
      case "list":
        return { items: [""], ordered: false }
      case "code":
        return { code: "", language: "javascript" }
      case "image":
        return { url: "", alt: "", caption: "" }
      case "quote":
        return { text: "", author: "" }
      case "checklist":
        return { items: [{ text: "", checked: false }] }
      default:
        return {}
    }
  }

  const updateBlock = (id: string, newContent: any) => {
    const newBlocks = content.map((block) => (block.id === id ? { ...block, content: newContent } : block))
    onChange(newBlocks)
  }

  const deleteBlock = (id: string) => {
    onChange(content.filter((block) => block.id !== id))
  }

  const moveBlock = (id: string, direction: "up" | "down") => {
    const index = content.findIndex((block) => block.id === id)
    if ((direction === "up" && index === 0) || (direction === "down" && index === content.length - 1)) {
      return
    }

    const newContent = [...content]
    const targetIndex = direction === "up" ? index - 1 : index + 1
    ;[newContent[index], newContent[targetIndex]] = [newContent[targetIndex], newContent[index]]
    onChange(newContent)
  }

  const renderBlock = (block: Block, index: number) => {
    return (
      <div key={block.id} className="group relative">
        <div className="flex items-start space-x-2">
          <div className="flex flex-col items-center space-y-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 cursor-grab">
              <GripVertical className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-destructive"
              onClick={() => deleteBlock(block.id)}
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>

          <div className="flex-1">{renderBlockContent(block)}</div>
        </div>

        <div className="flex justify-center mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowBlockMenu(showBlockMenu === block.id ? null : block.id)}
            className="h-6 px-2"
          >
            <Plus className="w-3 h-3 mr-1" />
            Add Block
          </Button>
        </div>

        {showBlockMenu === block.id && (
          <div className="flex justify-center mt-2">
            <Card className="p-2">
              <div className="flex items-center space-x-1">
                <Button variant="ghost" size="sm" onClick={() => addBlock("heading", block.id)}>
                  <Hash className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => addBlock("paragraph", block.id)}>
                  <Type className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => addBlock("list", block.id)}>
                  <List className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => addBlock("code", block.id)}>
                  <Code className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => addBlock("quote", block.id)}>
                  <Quote className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => addBlock("checklist", block.id)}>
                  <CheckSquare className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    )
  }

  const renderBlockContent = (block: Block) => {
    switch (block.type) {
      case "heading":
        return (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Select
                value={block.content.level.toString()}
                onValueChange={(value) => updateBlock(block.id, { ...block.content, level: Number.parseInt(value) })}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">H1</SelectItem>
                  <SelectItem value="2">H2</SelectItem>
                  <SelectItem value="3">H3</SelectItem>
                  <SelectItem value="4">H4</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Input
              placeholder="Heading text..."
              value={block.content.text}
              onChange={(e) => updateBlock(block.id, { ...block.content, text: e.target.value })}
              className={`font-bold ${
                block.content.level === 1
                  ? "text-3xl"
                  : block.content.level === 2
                    ? "text-2xl"
                    : block.content.level === 3
                      ? "text-xl"
                      : "text-lg"
              }`}
            />
          </div>
        )

      case "paragraph":
        return (
          <Textarea
            placeholder={placeholder || "Start writing..."}
            value={block.content.text}
            onChange={(e) => updateBlock(block.id, { ...block.content, text: e.target.value })}
            className="min-h-[100px] resize-none"
          />
        )

      case "list":
        return (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Select
                value={block.content.ordered ? "ordered" : "unordered"}
                onValueChange={(value) => updateBlock(block.id, { ...block.content, ordered: value === "ordered" })}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unordered">Bullet List</SelectItem>
                  <SelectItem value="ordered">Numbered List</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              {block.content.items.map((item: string, index: number) => (
                <div key={index} className="flex items-center space-x-2">
                  <span className="text-muted-foreground">{block.content.ordered ? `${index + 1}.` : "•"}</span>
                  <Input
                    placeholder="List item..."
                    value={item}
                    onChange={(e) => {
                      const newItems = [...block.content.items]
                      newItems[index] = e.target.value
                      updateBlock(block.id, { ...block.content, items: newItems })
                    }}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const newItems = block.content.items.filter((_: any, i: number) => i !== index)
                      updateBlock(block.id, { ...block.content, items: newItems })
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const newItems = [...block.content.items, ""]
                  updateBlock(block.id, { ...block.content, items: newItems })
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </div>
          </div>
        )

      case "code":
        return (
          <div className="space-y-2">
            <Select
              value={block.content.language}
              onValueChange={(value) => updateBlock(block.id, { ...block.content, language: value })}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="javascript">JavaScript</SelectItem>
                <SelectItem value="typescript">TypeScript</SelectItem>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="html">HTML</SelectItem>
                <SelectItem value="css">CSS</SelectItem>
                <SelectItem value="json">JSON</SelectItem>
                <SelectItem value="markdown">Markdown</SelectItem>
              </SelectContent>
            </Select>
            <Textarea
              placeholder="Enter your code..."
              value={block.content.code}
              onChange={(e) => updateBlock(block.id, { ...block.content, code: e.target.value })}
              className="font-mono text-sm min-h-[150px]"
            />
          </div>
        )

      case "quote":
        return (
          <div className="space-y-2">
            <Textarea
              placeholder="Quote text..."
              value={block.content.text}
              onChange={(e) => updateBlock(block.id, { ...block.content, text: e.target.value })}
              className="italic border-l-4 border-primary pl-4"
            />
            <Input
              placeholder="Author (optional)"
              value={block.content.author}
              onChange={(e) => updateBlock(block.id, { ...block.content, author: e.target.value })}
            />
          </div>
        )

      case "checklist":
        return (
          <div className="space-y-2">
            {block.content.items.map((item: any, index: number) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={(e) => {
                    const newItems = [...block.content.items]
                    newItems[index] = { ...item, checked: e.target.checked }
                    updateBlock(block.id, { ...block.content, items: newItems })
                  }}
                  className="rounded"
                />
                <Input
                  placeholder="Checklist item..."
                  value={item.text}
                  onChange={(e) => {
                    const newItems = [...block.content.items]
                    newItems[index] = { ...item, text: e.target.value }
                    updateBlock(block.id, { ...block.content, items: newItems })
                  }}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const newItems = block.content.items.filter((_: any, i: number) => i !== index)
                    updateBlock(block.id, { ...block.content, items: newItems })
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const newItems = [...block.content.items, { text: "", checked: false }]
                updateBlock(block.id, { ...block.content, items: newItems })
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {content.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Start building your document with blocks</p>
          <div className="flex justify-center space-x-2">
            <Button variant="outline" onClick={() => addBlock("heading")}>
              <Hash className="w-4 h-4 mr-2" />
              Heading
            </Button>
            <Button variant="outline" onClick={() => addBlock("paragraph")}>
              <Type className="w-4 h-4 mr-2" />
              Paragraph
            </Button>
            <Button variant="outline" onClick={() => addBlock("list")}>
              <List className="w-4 h-4 mr-2" />
              List
            </Button>
          </div>
        </div>
      ) : (
        content.map((block, index) => renderBlock(block, index))
      )}

      {content.length > 0 && (
        <div className="flex justify-center pt-4">
          <Button variant="ghost" onClick={() => setShowBlockMenu(showBlockMenu === "end" ? null : "end")}>
            <Plus className="w-4 h-4 mr-2" />
            Add Block
          </Button>
        </div>
      )}

      {showBlockMenu === "end" && (
        <div className="flex justify-center">
          <Card className="p-2">
            <div className="flex items-center space-x-1">
              <Button variant="ghost" size="sm" onClick={() => addBlock("heading")}>
                <Hash className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => addBlock("paragraph")}>
                <Type className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => addBlock("list")}>
                <List className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => addBlock("code")}>
                <Code className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => addBlock("quote")}>
                <Quote className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => addBlock("checklist")}>
                <CheckSquare className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
