import fs from 'fs'
import { parse } from 'parse5'

export interface ChildNode {
  nodeName: string
  tagName: string
  attrs: Array<any>
  namespaceURI: string
  childNodes: Array<any>
  parentNode: any
}

function xmlReader (xmlUsxFilePath: string): Promise<ChildNode | null | Error> {
  return new Promise((resolve, reject) => {
    fs.readFile(xmlUsxFilePath, 'utf8', (err, data) => {
      if (err) reject(err)

      const parsed: any = parse(data)

      const children: ChildNode[] = parsed.childNodes
      const html: ChildNode | null = children.filter((obj: ChildNode) => obj.nodeName === 'html')[0]
      const body: ChildNode | null = html.childNodes.filter((obj: ChildNode) => obj.nodeName === 'body')[0]
      resolve(body)
    })
  })
}

export default xmlReader
