/**
 * Step definitions.
 */
'use strict';

var _ = require('underscore');

// Require and configure the assertion libraries.
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised'); // https://github.com/domenic/chai-as-promised/
chai.use(chaiAsPromised);

// Convenience.
var expect = chai.expect;

// Require page objects.
var homePage = require('../../page-objects/home-page');

// Define the step definitions
module.exports = function myStepDefinitions() {


  this.Given(/^I am on the app home page\.?$/, function (done) {
    var expectedTitle = 'AngularJS • TodoMVC';

    // The page loading is async so we need an async expectation
    // and an async 'done'.
    expect(homePage.getPageTitle())
      .to.eventually.equal(expectedTitle)
      .notify(done);
  });


  this.When(/^I add a todo called "([^"]*)"\.?$/, function (todoText, done) {
    
    // Share state on the world object. Could also have done this with a closure.
    var world = this;
    world.expectedTodoText = todoText;

    homePage.createTodo(todoText);
    done();
  });


  // Use a data table. API here
  // https://github.com/cucumber/cucumber-js/blob/master/lib/cucumber/ast/data_table.js
  this.When(/^I add multiple todos:$/, function (table, done) {
    var world = this;

    // Array of arrays e.g.
    // [ [ 'First todo' ], [ 'Second todo' ] ]
    table = table.raw();

    // Flatten array
    // [ 'First todo', 'Second todo' ]
    table = _.flatten(table);

    table.forEach(function (todoText) {
      homePage.createTodo(todoText);
    });

    world.expectedNumberOfTodos = table.length;

    done(); 
  });


  this.When(/^Something is done\.$/, function (done) {
    // Write code here that turns the phrase above into concrete actions
    done.pending();
  });


  this.Then(/^I should see it added to the todo list\.?$/, function (done) {
    var world = this;

    // The underlying getText method and and all DOM action methods
    // (i.e. actions on 'elelement' objects) are asynchronous
    // because they wait for the Angular digest loop to settle down,
    // and so they return promises.
    homePage.getFirstTodoText()
      .then(function(todoText) {
        expect(todoText).to.equal(world.expectedTodoText);
        done();
      });
  });


  this.Then(/^there should be that number of todos in the list\.?$/, function (done) {
    var world = this;

    homePage.getNumberOfTodos()
      .then(function (numberOfTodos) {
        expect(numberOfTodos).to.equal(world.expectedNumberOfTodos);
        done();
      });
  });


  this.Then(/^there should be a measurable result\.$/, function (done) {
    // Write code here that turns the phrase above into concrete actions
    done.pending();
  });
};
