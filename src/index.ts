import path from 'path'
import fs from 'fs'
import usxStringToJson from './utils/niceUsfmJson/usxStringToJson'

// Background
// the earliest manuscripts of the old testament fall into three
// categories: the masoretic text, the septuagint, and the dead sea scrolls.
// the oldest actual manuscripts of the old testament are the dead sea scrolls.
// the dead sea scrolls were discovered in 1947 in caves near the dead sea.
// the dead sea scrolls are dated from 250 bc to 68 ad.
// the dead sea scrolls contain every book of the old testament except esther.
// the dead sea scrolls confirm the accuracy of the masoretic text.
// the septuagint is a greek translation of the old testament produced
// between 300-200 bc. the septuagint was the bible of the early church.
// the septuagint differs from the masoretic text in many places.
// the septuagint is a valuable tool in textual criticism.
// the masoretic text is the hebrew text of the old testament used by
// the jewish people from the time of christ until today.

// the masoretic text was produced between the 6th and 10th centuries ad.
// in its entirety, but thats not to say that bits and pieces of it
// dont go back to the time of christ and before.
// for the sake of this project, we will use the masoretic text since
// hebrew as a language predates greek, and the masoretic text is the
// oldest complete hebrew text of the old testament.
// the Leningrad Codex is the oldest complete masoretic text of the old testament.
// We will use the Westminster Leningrad Codex, which is a digital version
// of the Leningrad Codex, and is available from the Digital Bible Library.
// https://app.thedigitalbiblelibrary.org/entry?id=2c500771ea16da93

// The Digital Bible Library® (DBL) is an online digital asset and licensing
// management platform developed and maintained by the United Bible Societies.
// DBL gathers, validates, and safeguards a large collection of quality,
// standardized, digital Scripture texts and publication assets, in hundreds
// of languages — all contributed by a growing number of partnering translation
// agencies. DBL enables the secure licensing and distribution of these resources
// to approved internal or external ministry partners. In this way, DBL seeks to
// empower others to reach people from every tribe, in every nation, with the
// power of God’s Word in their heart language.

// if any non hebrew letters exist we need to strip them out
function stripNonHebrew (input: string) {
  return input.replace(/[^\u0590-\u05FF\uFB1D-\uFB4F]/g, '')
}

// we need to eliminate the Masoretic vowel pointing (nikkudot)
// as well as cantillation marks (ta'amim), and also consider the
// possible differences in the form of letters from the Aramaic or
// "square" script that developed around the 5th century BCE.
// Remove nikkudot and ta'amim
// (thank you GPT-4!)
function removeNikkudot (input: string) {
  return input.replace(/[\u0591-\u05C7]/g, '');
}

function run () {
  // get a path to Genesis text-file we got from from the Digital Bible Library
  const genesisFile = path.resolve(__dirname, '../src/bibles/westminster-leningrad-codex/release/USX_1/GEN.usx')

  // read the USX XML text-file of Genesis into memory
  const genesisFileContents = fs.readFileSync(genesisFile, 'utf8')

  // convert it to JSON, something we can work with, because it's easier
  const genesisJson = usxStringToJson(genesisFileContents)

  // In the Equidistant Letter Sequence (ELS), you choose a starting point
  // in a sequence of letters (like a long string of text), a skip number
  // (how many letters you skip each time), and a direction (forward or
  // backward). From the starting point, you count the number of letters
  // determined by the skip number in the direction you've chosen, and
  // note the letter there. This is repeated until a sequence of letters
  // form a word or phrase.

  // In creating this ELS, typically, all spaces, punctuation, and paragraph
  // indications are removed to form a continuous sequence of letters.
  // So "spaces" between words are removed when looking for a Bible Code.

  // so we will need to first create a long string of text only consisting
  // of only the verses in Genesis, then strip out all the spaces, punctuation,
  // and paragraph indications, and then we can start looking for Bible Codes.

  // remember that hebrew is read from right to left, so we will need to reverse
  // the order of the letters in each verse.
  let genesisString: string = ''
  let chapter: number = 0
  const chapters: { chapter: number, firstVerse: string, text: string }[] = []
  genesisJson.content.filter((obj: { type: string }) => obj.type === 'para:p').forEach((section: any) => {
    chapter += 1
    // filter out all the USX stuff that isn't a scripture verse
    // we dont need chapter or paragraph demarcations
    const onlyVerses = section.content.filter((obj: { type: string }) => obj.type !== 'verse:v')
    // we are going to join them so we need to reverse the array
    // because hebrew is a right to left language.
    // if we joined them as is it would mess them up
    const reversedVerses = Object.assign([], onlyVerses).reverse()
    const chapterText = reversedVerses.join('')

    // push the chapter into an array
    chapters.push({
      chapter,
      firstVerse: onlyVerses[0],
      text: chapterText
    })
  })

  // ok, now that we have our chapters, lets reverse the chapter order
  // because it's a right to left language, when we join the texts together
  // the result should be the full book of genesis from right to left
  const genesisPreParsedText = chapters.reverse().map(obj => obj.text).join('')
  // strip all non hebrew characters like spaces and phonetic additions added
  const noNonHebrewLetters = stripNonHebrew(genesisPreParsedText)
  // revert all characters back to their ancient versions
  // by removing the phonetic characters
  const noNikkudot = removeNikkudot(noNonHebrewLetters)

  // the last step we want to do is reverse the characters from right to left
  // over to left to right -- this will make it unreadable in hebrew
  // but this will allow us extract every Nth letter for our experiment
  // easier using javascript
  const readyText = noNikkudot.split('').reverse().join('')

  // OK we are ready for bible code experiments
  // we have been told to start from the first word in hebrew "bereshit"
  // and specifically to start with the "t", the expectation is that
  // we will find a sequence of characters spelling "torah" over and over again

  // "תורה" ("Torah")
  // ת (Tav) - Makes the "t" sound.
  // ו (Vav) - Can represent the "o" or "u" vowel sound in this context.
  // ר (Resh) - Makes the "r" sound.
  // ה (He) - Makes the "h" sound.

  // the first word in the Bible is
  // "בראשית" - "Bereshit" (In the beginning)
  // the letter "ת" is called "Tav". It is pronounced with a "t" sound
  // this means we should start with the 5th character in the string
  // javascript starts at index 0 instead of 1
  const startIndex = 4

  // ת (Tav)
  console.log(`experiment 1 - the 5th character should be "ת", ... was it?`)
  console.log(` ${readyText[startIndex]} -- ${readyText[startIndex] === 'ת' ? 'yes' : 'no'}`)
  if (readyText[startIndex] !== 'ת') throw new Error('failed experiment 1')
  // ***
  // => experiment 1 - the 5th character should be "ת", ... was it?
  // => ת -- yes

  // ו (Vav) 49 characters later
  console.log(`experiment 2 - add 50 characters, it should be "ו", ... was it?`)
  console.log(` ${readyText[startIndex + 49]} -- ${readyText[startIndex + 49] === 'ו' ? 'yes' : 'no'}`)
  // ***
  // => experiment 2 - add 50 characters, it should be "ו", ... was it?
  // => ה -- no
}

run()
