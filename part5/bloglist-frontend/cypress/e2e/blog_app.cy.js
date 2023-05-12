describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'olska',
      username: 'ollitoiv',
      password: 'salainen'
    }

    cy.request('POST', 'http://localhost:3003/api/users/', user)

    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('Log in to application')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('ollitoiv')
      cy.get('#password').type('salainen')
      cy.get('#login-button').click()

      cy.contains('olska logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('ollitoiv')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.contains('wrong credentials')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'ollitoiv', password: 'salainen' })

    })
    it('a new blog can be created', function() {
      cy.contains('New blog').click()
      cy.get('#author').type('Cypress')
      cy.get('#title').type('a blog created by cypress')
      cy.get('#url').type('cypress.com')

      cy.contains('save').click()
      cy.contains('a blog created by cypress')
    })

    describe('and a blog exists', function () {
      beforeEach(function () {
        cy.createBlog({
          author: 'Cypress again',
          title: 'Cypress strikes again',
          url: 'cypress.com'
        })
      })

      it('it can be liked', function () {
        cy.get('#view-button').click()
        cy.get('#like-button').click()
        cy.contains('Likes: 1')
      })

      it('it can be deleted by the creator', function () {
        cy.get('#view-button').click()
        cy.get('#delete-button').click()
        cy.window()
        cy.contains('Post deleted')
      })

      it('the delete button can be only seen by the creator', function(){

        cy.get('#logout-button').click()

        const anotherUser = {
          name: 'pekka',
          username: 'pekkap',
          password: 'salainen'
        }
        cy.request('POST', 'http://localhost:3003/api/users/', anotherUser)
        cy.login({ username: 'pekkap', password: 'salainen' })
        cy.get('#view-button').click()
        cy.get('#delete-button').should('not.exist')
      })


      it.only('blogs are arranged according to likes', function(){
        cy.createBlog({
          author: 'Cypress 2',
          title: 'Cypress 3000',
          url: 'cypress.com'
        })

        cy.contains('Cypress strikes again, Cypress again').parent().find('#view-button').click()
        cy.get('#like-button').click()
        cy.wait(1000)
        cy.get('#like-button').click()
        cy.get('#close-button').click()

        cy.contains('Cypress 3000, Cypress 2').parent().find('#view-button').click()
        cy.get('#like-button').click()
        cy.wait(1000)
        cy.get('#like-button').click()
        cy.wait(1000)
        cy.get('#like-button').click()
        cy.get('#close-button').click()

        cy.get('.blog').eq(0).should('contain', 'Cypress 3000, Cypress 2')
        cy.get('.blog').eq(1).should('contain', 'Cypress strikes again, Cypress again')

      })
    })
  })
})