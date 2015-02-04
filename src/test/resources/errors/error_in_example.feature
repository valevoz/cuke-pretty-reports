Feature: Error in example table
  As a User
  I want to action
  So that benefit

  Scenario Outline: A + B
    Given <a> and <b> as input
    When action
    Then the result should equal to <sum>

  Examples:
    | a | b | sum |
    | 1 | 1 | 2   |
    | 2 | 2 | 5   |
