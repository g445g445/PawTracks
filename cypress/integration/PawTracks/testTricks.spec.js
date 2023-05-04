it('tricks_page', () =>{ 

    cy.visit('http://localhost:3000/tricks');
    cy.viewport(1920, 1080)
    
cy.get('#amplify-id-0').click();
cy.get('#amplify-id-0').type('user');
cy.get('#amplify-id-2').click();
cy.get('#amplify-id-2').type('Testuser1!');
cy.get('.amplify-button--primary').click();
cy.get('form').submit();
cy.get('.mainContent > .cards:nth-child(3) > .cardLinks:nth-child(1) > .amplify-card > h2').click();
cy.get('.active > .linkText').click();
cy.get('.mainContent > .cards:nth-child(3) > .cardLinks:nth-child(2) > .amplify-card > h2').click();
cy.get('.active > .linkText').click();
cy.get('.mainContent > .cards:nth-child(3) > .cardLinks:nth-child(3) > .amplify-card > h2').click();

    
 
})