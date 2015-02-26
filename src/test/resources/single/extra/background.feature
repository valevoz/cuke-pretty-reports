Feature: Background
  As an User
  I want to see how background looks like
  So that I can make a decision to use the library or not

  Background:x
    Given background input
    And table
      | x | y  |
      | 1 | -1 |
    And background input

  Scenario: Background
    Given input
    When action
    Then result
