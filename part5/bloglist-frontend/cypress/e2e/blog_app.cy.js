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
      cy.get('#username').type('ollitoiv')
      cy.get('#password').type('salainen')
      cy.get('#login-button').click()
    })

    it('a new blog can be created', function() {
      cy.contains('New blog').click()
      cy.get('#author').type('Cypress')
      cy.get('#title').type('a blog created by cypress')
      cy.get('#url').type('cypress.com')

      cy.contains('save').click()
      cy.contains('a blog created by cypress')
    })
  })
})