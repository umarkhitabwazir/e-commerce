import React from 'react'
import Products from './components/Products'
const homePage = ({ searchParams }: {
  searchParams: { [key: string]: string }

}
) => {

  return (
    <div>
      <Products searchParams={searchParams}/>
    </div>
  )
}

export default homePage
