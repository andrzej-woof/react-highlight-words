import PropTypes from 'prop-types'
import React from 'react'
import Highlighter from './Highlighter'
import { render } from './test-utils'
import expect from 'expect.js'
import latinize from 'latinize'

describe('Highlighter', () => {
  const HIGHLIGHT_CLASS = 'customHighlightClass'
  const HIGHLIGHT_QUERY_SELECTOR = `.${HIGHLIGHT_CLASS}`
  const UNHIGHLIGHT_CLASS = 'customUnhighlightClass'
  const UNHIGHLIGHT_QUERY_SELECTOR = `.${UNHIGHLIGHT_CLASS}`

  function getHighlighterChildren ({
    autoEscape,
    activeClassName,
    activeStyle,
    activeIndex,
    caseSensitive,
    findChunks,
    highlightStyle,
    highlightTag,
    sanitize,
    searchWords,
    textToHighlight,
    unhighlightTag,
    unhighlightStyle,
    highlightClassName,
    ref,
    ...rest
  }) {
    render(
      <div>
        <Highlighter
          ref={ref}
          activeClassName={activeClassName}
          activeIndex={activeIndex}
          activeStyle={activeStyle}
          autoEscape={autoEscape}
          caseSensitive={caseSensitive}
          findChunks={findChunks}
          highlightClassName={highlightClassName || HIGHLIGHT_CLASS}
          highlightStyle={highlightStyle}
          highlightTag={highlightTag}
          sanitize={sanitize}
          searchWords={searchWords}
          textToHighlight={textToHighlight}
          unhighlightTag={unhighlightTag}
          unhighlightClassName={UNHIGHLIGHT_CLASS}
          unhighlightStyle={unhighlightStyle}
          {...rest}
        />
      </div>
    )
  }

  let consoleError

  beforeEach(() => {
    consoleError = console.error

    // React DEV warnings should fail tests
    console.error = function (message) {
      consoleError.apply(console, arguments)
      throw new Error(message)
    }
  })

  afterEach(() => {
    console.error = consoleError
  })

  it('should properly handle empty searchText', () => {
    const emptyValues = [[], ['']]
    emptyValues.forEach((emptyValue) => {
      getHighlighterChildren({
        searchWords: emptyValue,
        textToHighlight: 'This is text',
        ref: (node) => {
          expect(node.children.length).to.equal(1)
          expect(node.querySelectorAll(HIGHLIGHT_QUERY_SELECTOR).length).to.equal(0)
          expect(node.textContent).to.eql('This is text')
        }
      })
    })
  })

  it('should properly handle empty textToHighlight', () => {
    getHighlighterChildren({
      searchWords: ['search'],
      textToHighlight: '',
      ref: (node) => {
        expect(node.children.length).to.equal(0)
        expect(node.querySelectorAll(HIGHLIGHT_QUERY_SELECTOR).length).to.equal(0)
        expect(node.textContent).to.eql('')
      }
    })
  })

  it('should highlight searchText words that exactly match words in textToHighlight', () => {
    getHighlighterChildren({
      searchWords: ['text'],
      textToHighlight: 'This is text',
      ref: (node) => {
        expect(node.children.length).to.equal(2)
        const matches = node.querySelectorAll(HIGHLIGHT_QUERY_SELECTOR)
        expect(matches.length).to.equal(1)
        expect(matches[0].textContent).to.eql('text')
      }
    })
  })

  it('should handle unclosed parentheses when autoEscape prop is truthy', () => {
    getHighlighterChildren({
      autoEscape: true,
      searchWords: ['('],
      textToHighlight: '(This is text)',
      ref: (node) => {
        expect(node.children.length).to.equal(2)
        expect(node.children[0].textContent).to.equal('(')
        expect(node.children[1].textContent).to.equal('This is text)')
        const matches = node.querySelectorAll(HIGHLIGHT_QUERY_SELECTOR)
        expect(matches.length).to.equal(1)
        expect(matches[0].textContent).to.eql('(')
      }
    })
  })

  it('should highlight searchText words that partial-match text in textToHighlight', () => {
    getHighlighterChildren({
      searchWords: ['Th'],
      textToHighlight: 'This is text',
      ref: (node) => {
        expect(node.children.length).to.equal(2)
        const matches = node.querySelectorAll(HIGHLIGHT_QUERY_SELECTOR)
        expect(matches.length).to.equal(1)
        expect(matches[0].textContent).to.eql('Th')
        expect(node.children[0].textContent).to.equal('Th')
        expect(node.children[1].textContent).to.equal('is is text')
      }
    })
  })

  it('should highlight multiple occurrences of a searchText word', () => {
    getHighlighterChildren({
      searchWords: ['is'],
      textToHighlight: 'This is text',
      ref: (node) => {
        expect(node.children.length).to.equal(5)
        expect(node.querySelectorAll(HIGHLIGHT_QUERY_SELECTOR).length).to.equal(2)
        expect(node.textContent).to.eql('This is text')
        expect(node.children[0].textContent).to.equal('Th')
        expect(node.children[1].textContent).to.equal('is')
        expect(node.children[2].textContent).to.equal(' ')
        expect(node.children[3].textContent).to.equal('is')
        expect(node.children[4].textContent).to.equal(' text')
      }
    })
  })

  it('should highlight multiple searchText words', () => {
    getHighlighterChildren({
      searchWords: ['This', 'text'],
      textToHighlight: 'This is text',
      ref: (node) => {
        expect(node.children.length).to.equal(3)
        expect(node.querySelectorAll(HIGHLIGHT_QUERY_SELECTOR).length).to.equal(2)
        expect(node.textContent).to.eql('This is text')
        expect(node.children[0].textContent).to.equal('This')
        expect(node.children[1].textContent).to.equal(' is ')
        expect(node.children[2].textContent).to.equal('text')
      }
    })
  })

  it('should handle Regex searchText', () => {
    getHighlighterChildren({
      searchWords: [/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/, 'This'],
      textToHighlight: 'This is my phone (123) 456 7899',
      ref: (node) => {
        expect(node.querySelectorAll(HIGHLIGHT_QUERY_SELECTOR).length).to.equal(2)
        expect(node.textContent).to.eql('This is my phone (123) 456 7899')
        expect(node.children[0].textContent).to.equal('This')
        expect(node.children[1].textContent).to.equal(' is my phone ')
        expect(node.children[2].textContent).to.equal('(123) 456 7899')
      }
    })
  })

  it('should match terms in a case insensitive way but show their case-sensitive representation', () => {
    getHighlighterChildren({
      searchWords: ['this'],
      textToHighlight: 'This is text',
      ref: (node) => {
        const matches = node.querySelectorAll(HIGHLIGHT_QUERY_SELECTOR)
        expect(matches.length).to.equal(1)
        expect(matches[0].textContent).to.equal('This')
      }
    })
  })

  it('should use the :highlightClassName if specified', () => {
    getHighlighterChildren({
      searchWords: ['text'],
      textToHighlight: 'This is text',
      ref: (node) => {
        expect(node.querySelector('mark').className).to.contain(HIGHLIGHT_CLASS)
      }
    })
  })

  it('should use the :highlightStyle if specified', () => {
    getHighlighterChildren({
      highlightStyle: { color: 'red' },
      searchWords: ['text'],
      textToHighlight: 'This is text',
      ref: (node) => {
        expect(node.querySelector('mark').style.color).to.contain('red')
      }
    })
  })

  it('should use the :unhighlightStyle if specified', () => {
    getHighlighterChildren({
      unhighlightStyle: { color: 'gray' },
      searchWords: ['text'],
      textToHighlight: 'This is text',
      ref: (node) => {
        expect(node.querySelector('span').style.color).to.contain('gray')
      }
    })
  })

  it('should match terms without accents against text with accents', () => {
    getHighlighterChildren({
      sanitize: latinize,
      searchWords: ['example'],
      textToHighlight: 'ỆᶍǍᶆṔƚÉ',
      ref: (node) => {
        const matches = node.querySelectorAll(HIGHLIGHT_QUERY_SELECTOR)
        expect(matches.length).to.equal(1)
        expect(matches[0].textContent).to.equal('ỆᶍǍᶆṔƚÉ')
      }
    })
  })

  it('should use the :highlightTag if specified', () => {
    getHighlighterChildren({
      autoEscape: true,
      highlightTag: 'span',
      searchWords: ['text'],
      textToHighlight: 'This is text',
      ref: (node) => {
        const matches = node.querySelectorAll(HIGHLIGHT_QUERY_SELECTOR)
        expect(matches[0].tagName).to.equal('SPAN')
      }
    })
  })

  it('should support class components via :highlightTag', () => {
    class HighlightTag extends React.Component {
      static propTypes = {
        children: PropTypes.any,
        highlightIndex: PropTypes.number
      }

      render () {
        const { highlightIndex, ...rest } = this.props

        return (
          <span {...rest} />
        )
      }
    }

    getHighlighterChildren({
      autoEscape: true,
      highlightTag: HighlightTag,
      searchWords: ['text'],
      textToHighlight: 'This is text',
      ref: (node) => {
        const matches = node.querySelectorAll(HIGHLIGHT_QUERY_SELECTOR)
        expect(matches[0].tagName).to.equal('SPAN')
      }
    })
  })

  it('should support stateless functional components via :highlightTag', () => {
    const HighlightTag = ({ highlightIndex, ...rest }) => (
      <span {...rest} />
    )

    getHighlighterChildren({
      autoEscape: true,
      highlightTag: HighlightTag,
      searchWords: ['text'],
      textToHighlight: 'This is text',
      ref: (node) => {
        const matches = node.querySelectorAll(HIGHLIGHT_QUERY_SELECTOR)
        expect(matches[0].tagName).to.equal('SPAN')
      }
    })
  })

  it('should apply activeClassName to the match specified by activeIndex', () => {
    const activeClassName = 'active'
    getHighlighterChildren({
      activeIndex: 1,
      activeClassName,
      searchWords: ['text'],
      textToHighlight: 'This is text which should have this text highlighted',
      ref: (node) => {
        const matches = node.querySelectorAll('mark')
        expect(matches[1].classList.contains(activeClassName)).to.equal(true)
      }
    })
  })

  it('should apply activeStyle to the match specified by activeIndex', () => {
    const activeStyle = { color: 'red' }
    getHighlighterChildren({
      activeIndex: 1,
      activeStyle,
      searchWords: ['text'],
      textToHighlight: 'This is text which should have this text highlighted',
      ref: (node) => {
        const matches = node.querySelectorAll('mark')
        expect(matches[1].style.color).to.equal('red')
      }
    })
  })

  it('should support caseSensitive search', () => {
    getHighlighterChildren({
      caseSensitive: true,
      searchWords: ['th'],
      textToHighlight: 'This the three time',
      ref: (node) => {
        const matches = node.querySelectorAll(HIGHLIGHT_QUERY_SELECTOR)
        expect(matches).to.have.length(2)
        expect(matches[0].textContent).to.equal('th')
        expect(matches[1].textContent).to.equal('th')
      }
    })
  })

  it('should support custom findChunks prop function', () => {
    getHighlighterChildren({
      findChunks: () => (
        [
          { start: 0, end: 1 },
          { start: 5, end: 7 }
        ]
      ),
      searchWords: ['xxx'],
      textToHighlight: 'This is text',
      ref: (node) => {
        const matches = node.querySelectorAll(HIGHLIGHT_QUERY_SELECTOR)
        expect(matches).to.have.length(2)
        expect(matches[0].textContent).to.equal('T')
        expect(matches[1].textContent).to.equal('is')
      }
    })

    getHighlighterChildren({
      findChunks: () => (
        []
      ),
      searchWords: ['This'],
      textToHighlight: 'This is text',
      ref: (node2) => {
        const matches2 = node2.querySelectorAll(HIGHLIGHT_QUERY_SELECTOR)
        expect(matches2).to.have.length(0)
      }
    })
  })

  it('should render chucks with the appropriate classes when case-insensitive', () => {
    getHighlighterChildren({
      searchWords: ['This', 'is', 'text'],
      textToHighlight: 'This is text',
      highlightClassName: { This: 'this', is: 'is', text: 'text' },
      ref: (node) => {
        const allMatches = node.querySelectorAll('mark')
        expect(allMatches).to.have.length(3)
        expect(allMatches[0].classList).to.contain('this')
        expect(allMatches[1].classList).to.contain('is')
        expect(allMatches[2].classList).to.contain('text')
      }
    })
  })

  it('should render chucks with the appropriate classes when case-sensitive', () => {
    getHighlighterChildren({
      caseSensitive: true,
      searchWords: ['This', 'is', 'TEXT'],
      textToHighlight: 'This is TEXT',
      highlightClassName: { this: 'this', is: 'is', text: 'text' },
      ref: (node) => {
        const allMatches = node.querySelectorAll('mark')
        expect(allMatches).to.have.length(3)
        expect(allMatches[0].classList).not.to.contain('this')
        expect(allMatches[1].classList).to.contain('is')
        expect(allMatches[2].classList).not.to.contain('text')
      }
    })
  })

  it('should spread additional custom props onto the wrapper span', () => {
    getHighlighterChildren({
      searchWords: ['This', 'is', 'TEXT'],
      textToHighlight: 'This is TEXT',
      'data-test-attribute': 'data attribute content',
      title: 'span title',
      className: 'test-class',
      ref: (node) => {
        const matches = node.querySelectorAll('.test-class')
        expect(matches).to.have.length(0)
        expect(node.title).to.equal('span title')
        expect(node.classList.contains('test-class')).to.equal(true)
        expect(node.dataset.testAttribute).to.equal('data attribute content')
      }
    })
  })

  it('should use :unhighlightTag if provided', () => {
    getHighlighterChildren({
      searchWords: ['This', 'is', 'TEXT'],
      textToHighlight: 'Hello World',
      unhighlightTag: 'div',
      unhighlightClassName: UNHIGHLIGHT_CLASS,
      ref: (node) => {
        const matches = node.querySelectorAll(`.${UNHIGHLIGHT_CLASS}`)
        expect(matches).to.have.length(1)
        expect(matches[0].nodeName).to.equal('DIV')
      }
    })
  })

  it('should support class components via :unhighlightTag', () => {
    class UnHighlightTag extends React.Component {
      static propTypes = {
        children: PropTypes.any,
        highlightIndex: PropTypes.number
      }

      render () {
        const { highlightIndex, ...rest } = this.props

        return (
          <a {...rest} />
        )
      }
    }

    getHighlighterChildren({
      autoEscape: true,
      unhighlightTag: UnHighlightTag,
      searchWords: ['text'],
      textToHighlight: 'This is text',
      ref: (node) => {
        const matches = node.querySelectorAll(UNHIGHLIGHT_QUERY_SELECTOR)
        expect(matches[0].tagName).to.equal('A')
      }
    })
  })

  it('should support stateless functional components via :unhighlightTag', () => {
    const UnHighlightTag = ({ highlightIndex, ...rest }) => (
      <a {...rest} />
    )

    getHighlighterChildren({
      autoEscape: true,
      unhighlightTag: UnHighlightTag,
      searchWords: ['text'],
      textToHighlight: 'This is text',
      ref: (node) => {
        const matches = node.querySelectorAll(UNHIGHLIGHT_QUERY_SELECTOR)
        expect(matches[0].tagName).to.equal('A')
      }
    })
  })
})
