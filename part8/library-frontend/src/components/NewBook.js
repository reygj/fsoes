import React, { useState } from 'react'
import { gql, useMutation, useSubscription } from '@apollo/client';
import { ALL_AUTHORS } from './Authors'
import { ALL_BOOKS } from './Books'



const ADD_BOOK = gql`
mutation addBook($title: String!, $author: String!, $published: Int!, $genres: [String!]! ){
  addBook (
    title: $title,
    author: $author,
    published: $published,
    genres: $genres
  )
  {
    title
    author {name}
    published
    genres
  }
}`

const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      title
      author {name}
      published
      genres
    }
  }
  
`



const NewBook = (props) => {
  const [addBook] = useMutation(ADD_BOOK, {
    refetchQueries: [  
        {query: ALL_BOOKS,
          variables: {genre: null}
        } ,
        {query: ALL_AUTHORS}
    ] 
  })

  
  

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const addedBook = subscriptionData.data.bookAdded
      alert(`${addedBook.title} added`)
    }
  })


 


  const [title, setTitle] = useState('')
  const [author, setAuhtor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

  if (!props.show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()

    
    addBook({ variables: {title, author, published, genres}})

    setTitle('')
    setPublished('')
    setAuhtor('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuhtor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type='number'
            value={published}
            onChange={({ target }) => setPublished(Number(target.value))}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">add genre</button>
        </div>
        <div>
          genres: {genres.join(' ')}
        </div>
        <button type='submit'>create book</button>
      </form>
    </div>
  )
}

export default NewBook