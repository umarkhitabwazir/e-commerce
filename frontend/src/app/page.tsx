import React from 'react'
import Products from './components/Products.component'
const homePage = ({ searchParams }: {
  searchParams: { [key: string]: string }

}
) => {

  return (
    <div>
      <Products />
    </div>
  )
}

export default homePage
