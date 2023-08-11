import dayjs from 'dayjs';

import { Activity } from './interfaces';

import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

describe('Main page', () => {
  beforeEach(() => {
    cy.createAndLogin();
  });

  it('should include chart and message about absence of activities', () => {
    cy.get('#activity-timeline-chart').should('exist');
    cy.get('input[placeholder="Filter by activity"]').should('not.exist');
    cy.get('ul#activity-feed').should('not.exist');
    cy.get('#empty-activity-feed p').contains(`Let's get things moving!`);
  });

  it('should include chart and activity feed when activities present', () => {
    cy.setupActivity();

    cy.reload();

    cy.get('#activity-timeline-chart canvas').should('exist');
    cy.get('input[placeholder="Filter by activity"]').should('exist');
    cy.get('ul#activity-feed').should('exist');
    cy.get('#empty-activity-feed').should('not.exist');
  });

  it('should render activity in the activity feed', () => {
    cy.setupActivity();

    cy.reload();

    cy.get('@activity').then((activity: Activity) => {
      cy.get('ul#activity-feed').should('exist');
      cy.get('ul#activity-feed li').should('have.length', 1);
      cy.get('ul#activity-feed li').contains(activity.action);
      cy.get('ul#activity-feed li').contains(activity.username);
      cy.get('ul#activity-feed li').contains(dayjs(activity.time).fromNow());
    });
  });

  it('should apply filter for chart & activity feed when specific action chosen', () => {
    cy.setupActivity(1);
    cy.setupActivity(2);

    cy.reload();

    cy.get('@activity2').then((activity: Activity) => {
      cy.get('input[placeholder="Filter by activity"]').type(activity.action);
      cy.get('.autocomplete ul li').should('have.length', 1);

      const query = new URLSearchParams({ action: activity.action });
      cy.intercept('GET', `/api/reports/activity/timeline?${query}`).as('chartRequest');

      cy.get('.autocomplete ul li').contains(activity.action).click();

      cy.wait('@chartRequest').its('response.statusCode').should('eq', 200);

      cy.get('ul#activity-feed li').should('have.length', 1);
      cy.get('ul#activity-feed li').contains(activity.action);
      cy.get('ul#activity-feed li').contains(activity.username);
      cy.get('ul#activity-feed li').contains(dayjs(activity.time).fromNow());
    });
  });

  it('should clear applied filter for chart & activity feed', () => {
    cy.setupActivity(1);
    cy.setupActivity(2);

    cy.reload();

    cy.get('@activity2').then((activity: Activity) => {
      cy.get('input[placeholder="Filter by activity"]').type(activity.action);
      cy.get('.autocomplete ul li').should('have.length', 1);
      cy.get('.autocomplete ul li').contains(activity.action).click();

      cy.intercept('GET', '/api/reports/activity/timeline?').as('chartRequest');

      cy.get('svg[aria-labelledby="title-clear-filter"]').click();

      cy.wait('@chartRequest')
        .its('response.statusCode')
        .should('match', /(200|304)/);

      cy.get('ul#activity-feed li').should('have.length', 2);
    });
  });

  it('should redirect customer from auth pages when authorized', () => {
    cy.visit('/login');
    cy.location('pathname').should('eq', '/');
    cy.visit('/signup');
    cy.location('pathname').should('eq', '/');
  });
});
