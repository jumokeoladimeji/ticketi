describe('Ticket Controller', () => {
    it('returns JSON', () => {
        cy.request(`/api/v1/users/${createdCustomerData.data.id}/tickets/${createdTicketData.id}`)
            .its('headers')
            .its('content-type')
            .should('include', 'application/json')
    })

    it('loads 2 items', () => {
        cy.request(`/api/v1/users/${createdCustomerData.data.id}/tickets/${createdTicketData.id}`)
            .its('body')
            .should('have.length', 3)
    }); 
});