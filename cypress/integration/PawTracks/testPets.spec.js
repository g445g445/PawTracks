it('pets_page', () =>{ 

    cy.visit('http://localhost:3000/pets');
    cy.viewport(1920, 1080)
cy.get('#amplify-id-0').click();
cy.get('#amplify-id-0').type('test2');
cy.get('#amplify-id-2').click();
cy.get('#amplify-id-2').type('mSGT2pM7GTp3PB5!');
cy.get('.amplify-button--primary').click();
cy.get('form').submit();
cy.get('.add-button').click();
cy.get('#amplify-id-8').click();
cy.get('#amplify-id-8').type('test');
cy.get('#amplify-id-9').click();
cy.get('#amplify-id-9').type('45');
cy.get('#amplify-id-10').click();
cy.get('#amplify-id-10').type('7');
cy.get('#amplify-id-11').select('DOG');
cy.get('#amplify-id-12').click();
cy.get('#amplify-id-12').type('mix');
cy.get('#amplify-id-13').click();
cy.get('#amplify-id-13').type('this is a test');
cy.get('.amplify-button--primary').click();
cy.get('.amplify-grid').submit();
cy.wait(5);
cy.get('.edit-icon').click();
cy.get('label:contains("Desc")')  // select the label element
            .invoke('attr', 'for')  // get the value of the "for" attribute
            .then((inputId) => {
                cy.get(`#${inputId}`)  // select the input element with the corresponding ID
                    .type('this is another test')  // enter a value in the input
            })
cy.get('.amplify-button:nth-child(2)').click();
cy.get('.amplify-grid').submit();
cy.get('.delete-icon').click();
cy.get('.signOut').click();


    
 
})

