<template lang="pug">
.tip-tap(v-if="editor")
  .group-btns
    v-btn(@click="editor.chain().focus().toggleBold().run()" :class="{ 'is-active': editor.isActive('bold') }")
      v-icon mdi-format-bold
    v-btn(@click="editor.chain().focus().toggleItalic().run()" :class="{ 'is-active': editor.isActive('italic') }")
      v-icon mdi-format-italic
    v-btn(@click="editor.chain().focus().toggleStrike().run()" :class="{ 'is-active': editor.isActive('strike') }")
      v-icon mdi-format-strikethrough-variant
    v-btn(@click="editor.chain().focus().toggleCode().run()" :class="{ 'is-active': editor.isActive('code') }")
      v-icon mdi-code-tags
    v-btn(@click="editor.chain().focus().toggleHighlight({ color: '#74c0fc' }).run()" :class="{ 'is-active': editor.isActive('highlight', { color: '#74c0fc' }) }")
      v-icon mdi-marker

    v-btn(@click="editor.chain().focus().setParagraph().run()" :class="{ 'is-active': editor.isActive('paragraph') }")
      v-icon mdi-format-paragraph
    v-btn(@click="editor.chain().focus().toggleHeading({ level: 1 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }")
      v-icon mdi-format-header-1
    v-btn(@click="editor.chain().focus().toggleHeading({ level: 2 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }")
      v-icon mdi-format-header-2
    v-btn(@click="editor.chain().focus().toggleHeading({ level: 3 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }")
      v-icon mdi-format-header-3
    v-btn(@click="editor.chain().focus().toggleHeading({ level: 4 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 4 }) }")
      v-icon mdi-format-header-4

    v-btn(@click="editor.chain().focus().toggleBulletList().run()" :class="{ 'is-active': editor.isActive('bulletList') }")
      v-icon mdi-format-list-bulleted
    v-btn(@click="editor.chain().focus().toggleOrderedList().run()" :class="{ 'is-active': editor.isActive('orderedList') }")
      v-icon mdi-format-list-numbered

    v-btn(@click="editor.chain().focus().toggleBlockquote().run()" :class="{ 'is-active': editor.isActive('blockquote') }")
      v-icon mdi-format-quote-close
    v-btn(@click="addImage")
      v-icon mdi-image

    v-btn(@click="editor.chain().focus().undo().run()")
      v-icon mdi-undo
    v-btn(@click="editor.chain().focus().redo().run()")
      v-icon mdi-redo

  editor-content.editor(:editor="editor")
</template>

<script>
import { Editor, EditorContent } from '@tiptap/vue-2'
import StarterKit from '@tiptap/starter-kit'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import Image from '@tiptap/extension-image'
import Dropcursor from '@tiptap/extension-dropcursor'
import Highlight from '@tiptap/extension-highlight'
export default {
  components: {
    EditorContent,
  },
  props: {
    value: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      editor: null,
    }
  },
  watch: {
    value(value) {
      // HTML
      const isSame = this.editor.getHTML() === value
      if (isSame) return
      this.editor.commands.setContent(this.value, false)
    },
  },
  mounted() {
    this.editor = new Editor({
      content: '',
      extensions: [
        StarterKit,
        Document,
        Paragraph,
        Text,
        Image,
        Dropcursor,
        Highlight.configure({ multicolor: true }),
      ],
      content: this.value,
      onUpdate: () => {
        // HTML
        this.$emit('input', this.editor.getHTML())
      },
    })
  },
  methods: {
    addImage() {
      const url = window.prompt('URL')
      if (url) {
        this.editor.chain().focus().setImage({ src: url }).run()
      }
    },
  },
  beforeDestroy() {
    this.editor.destroy()
  },
}
</script>

<style lang="scss" scoped>
.tip-tap::v-deep {
  .group-btns {
    display: flex;
    flex-wrap: wrap;
    .v-btn {
      border-radius: 0 !important;
      margin-top: -1px;
      margin-right: -1px;
      box-shadow: none;
      border: 1px solid #d0d0d0;
    }
    .is-active {
      background-color: #d0d0d0 !important;
    }
  }
  .editor {
    padding: 10px;
    div:focus,
    div:active {
      outline: none;
    }
    .ProseMirror {
      > * + * {
        margin-top: 0.75em;
      }
      ul,
      ol {
        padding: 0 1rem;
      }
      h1,
      h2,
      h3,
      h4,
      h5,
      h6 {
        line-height: 1.1;
      }
      code {
        background-color: rgba(#616161, 0.1);
        color: #616161;
      }
      pre {
        background: #0d0d0d;
        color: #fff;
        font-family: 'JetBrainsMono', monospace;
        padding: 0.75rem 1rem;
        border-radius: 0.5rem;
        code {
          color: inherit;
          padding: 0;
          background: none;
          font-size: 0.8rem;
        }
      }
      img {
        max-width: 100%;
        height: auto;
      }
      blockquote {
        padding-left: 1rem;
        border-left: 2px solid rgba(#0d0d0d, 0.1);
      }
      hr {
        border: none;
        border-top: 2px solid rgba(#0d0d0d, 0.1);
        margin: 2rem 0;
      }
    }
  }
}
</style>