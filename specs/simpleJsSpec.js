describe("Simple Test case", function() {
  it("Simple jasmine test case", function() {
    expect(true).toBe(true);
  });
});

describe("Spec - variable", function() {
  it("A variable 'a' which sould contains 'Hello World' text", function() {
    expect(a).toEqual("Hello World");
  });
});

describe("Spec - Dom manipulation", function() {
  it("The page should contains the div tag with header tag", function() {
    expect($("div#header").length).toEqual(1);
  //  expect(false).toEqual(false);
  });
});
