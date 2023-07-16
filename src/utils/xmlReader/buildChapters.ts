interface Opts {
  nodeName: string
  tagName: string
  value: string
  childNodes: Opts[]
  attrs: {
    name: string,
    value: string
  }[]
}

function buildChapters (childNodes: Opts[]): any[] {
  const chapter = childNodes.filter((obj: Opts) => obj.nodeName === 'chapter')[0]
  const chapters = []
  if (chapter) {
    interface Text {
      type: string
      text: string
    }
    interface Verse {
      num: number
      type: string
      parts: Text[]
    }
    const paragraphs: (Text | Verse)[] = []
    const paraOpts = chapter.childNodes.filter((obj: Opts) => obj.nodeName === 'para')
    let verseNum = 0
    paraOpts.forEach((para: Opts) => {
      para.childNodes.forEach((obj: Opts) => {
        if (!obj.childNodes || obj.childNodes.length === 0) {
          // is it a top level element?
          console.log('top level element')
          paragraphs.push({ type: obj.nodeName, text: obj.value })
        } else {
          // has sub elements
          if (obj.nodeName === 'verse') {
            console.log('verse')
            verseNum += 1
            const verse: Verse = {
              num: verseNum,
              type: obj.nodeName,
              parts: []
            }
            obj.childNodes.forEach((child: Opts) => {
              console.log({ child })
              console.log()
              verse.parts.push({ type: child.nodeName, text: child.value })
            })
            paragraphs.push(verse)
          } else {
            console.log('something OTHER than verse')
          }
        }
        console.log({ obj })
        console.log()
      })
    })
    chapters.push(paragraphs)
  }

  if (chapter.childNodes.filter((obj: Opts) => obj.nodeName === 'chapter').length > 0) {
    // has a chapter sub element
  }

  return chapters
}

export default buildChapters
