file:: [For_the_Love_of_Go_1.22_(2023)_1708841581706_0.pdf](../assets/For_the_Love_of_Go_1.22_(2023)_1708841581706_0.pdf)
file-path:: ../assets/For_the_Love_of_Go_1.22_(2023)_1708841581706_0.pdf

- While all you need to write and run Go programs is a terminal and a text editor,
  ls-type:: annotation
  hl-page:: 11
  hl-color:: yellow
  id:: 65dadb40-effe-42da-a79a-fefa5537fd22
	- this should be a website you can go to and it runs in the browser
-
- All these solutions are also available in a public GitHub repo here:• https://github.com/bitfield/ftl‐code #go/book/exercises
  hl-page:: 11
  ls-type:: annotation
  id:: 65dadb7f-06b3-4d4b-b5a5-4b15b87dd2ac
  hl-color:: yellow
-
- In some ways, the fact that Go doesn’t have many features is its best feature. It has enough features to do everything we need to do in building software, but no more.
  ls-type:: annotation
  hl-page:: 12
  hl-color:: yellow
  id:: 65dadbbc-3354-4d73-bd1a-2780af841273
- Go is humble, and that’s a good attitude for us to adopt, too. It doesn’t claim to be the world’s greatest programming language, the most advanced, or the most pure, elegant, and theoretically appealing. 
  ls-type:: annotation
  hl-page:: 12
  hl-color:: yellow
  id:: 65dadbd6-b31b-4552-845f-f45c208b407d
- By writing the test first, you are forced to think about what the program actually needs to do.
  ls-type:: annotation
  hl-page:: 13
  hl-color:: yellow
  id:: 65dadbff-e776-4c9e-8331-65f26b8c0c5e
	- lame
- Every Go project needs two things: a folder on disk to keep its source code in, and a go.mod file which identifies the module, or project name.
  ls-type:: annotation
  hl-page:: 14
  hl-color:: yellow
  id:: 65dadc55-a1af-4e95-a874-7853f7be92d0
- First, it must be in a file whose name ends in _test.go (there can be multiple tests in the same file). Go uses this filename pattern to recognise source code files that contain tests. Also, the name of a test function must begin with the word Test, or Go won’t recognise it as a test. It also has to accept a parameter whose type is *testing.T. Don’t worry about exactly what this is for the moment; think of it as the thing that allows us to con‐ trol the outcome of the test. #go/book/test
  hl-page:: 22
  ls-type:: annotation
  id:: 65dadcce-c514-4ad8-af60-f2f5c7789534
  hl-color:: yellow
-
- Takeaways• The go mod init command initialises a new Go project folder.• The go test command runs tests for a Go package.• The gofmt command will check Go code for standard formatting and fix it if ne‐ cessary.• A function declaration announces the name of a new function, and lists the para‐ meters it takes, along with any results it returns.• Whenever a Go test fails, it shows the exact file and line where the failure happened, as well as what failed.• The import keyword tells Go what other packages we want to use in this particu‐ lar Go file.• The testing package is part of Go’s standard library, and it provides everything we need to write and run tests.• The names of test functions begin with the word Test, and they take a *testing.T parameter which lets us control the test execution.• Use the want and got pattern to structure tests: express what result you want, and then compare it with what you got from calling the function under test.• We can call t.Errorf to cause the test to fail with a message, and if we don’t do that, the test will pass by default.25• An if statement is used to take some action (for example, fail the test) if some condition is true (for example, want doesn’t match got).
  ls-type:: annotation
  hl-page:: 25
  hl-color:: yellow
  id:: 65dadd5f-66bc-492e-9db0-5ce154a6be7e
- First, we need to change the name of the test, because Go doesn’t allow us to have two functions with the same name in the same package. We’ll change the name to TestMultiply.
  ls-type:: annotation
  hl-page:: 28
  hl-color:: yellow
  id:: 65dadd8f-e936-4b1d-9f7e-8af199654709
- These are sometimes called30 table tests, because they represent the test data as a table of inputs together with their expected results.
  ls-type:: annotation
  hl-page:: 30
  hl-color:: yellow
  id:: 65dade69-960c-49f9-b5a4-64ab109d6f8b
- If you already have some experience of Go, you may be familiar with the notion of a slice: it’s just Go’s name for a bunch of things. In some languages this is called an array, but it’s the same idea whatever we call it: a sequence of values of the same type.
  ls-type:: annotation
  hl-page:: 31
  hl-color:: yellow
  id:: 65dade81-04c5-4698-b200-6d54ac99ea27
- struct is Go’s name for a structured data type: that is, some‐ thing that contains multiple different bits of information, united into a single record.
  ls-type:: annotation
  hl-page:: 31
  hl-color:: yellow
  id:: 65dade8d-a420-4594-b4b9-c1031bda047d
- These are called documentation comments, because when you pub‐ lish your project to a hosting site such as GitHub, your comments will be automatic‐ ally turned into browsable documentation on the pkg.go.dev site.
  ls-type:: annotation
  hl-page:: 55
  hl-color:: yellow
  id:: 65dadfaf-3078-4633-98ea-ec583d5cda18
- Anything with such a name is available outside the package where it’s defined (we say it’s exported). If you define a type (or a function, a variable, or anything else) whose name starts with a lowercase letter (customer, for example), it is unexported and so you won’t be able to refer to it in code that’s outside this package (in a test, for example).
  ls-type:: annotation
  hl-page:: 56
  hl-color:: yellow
  id:: 65dadfce-cfe4-4295-8544-091f6de522b4
- You could think of exported names, with the initial capital letter, as identifying things that the package intends to be public, while the unexported names, with a lowercase initial letter, are private things that the package is going to use internally, but no one else needs to know about.
  ls-type:: annotation
  hl-page:: 56
  hl-color:: yellow
  id:: 65dadfda-487a-4e6e-be86-fd283c950ba7
- A great way to approach this is to think about it from the point of view of users of our software. Even if this is only a fun project for recreation or learning, and we don’t anti‐ cipate having any real users other than ourselves, we can use it as a thinking tool, and imagine what users would want to do with the software and how they’d like to interact with it.
  ls-type:: annotation
  hl-page:: 61
  hl-color:: yellow
  id:: 65dae01d-6fce-4878-ba4a-4b5498ae8581
- You now know everything you need to write the test for the “buy a book” story. It will follow the same basic structure that we used for the calculator tests: set up your in‐ puts and expectations (your want), call a function, and check the results (your got).
  ls-type:: annotation
  hl-page:: 64
  hl-color:: yellow
  id:: 65dae1b1-1c1e-4ae7-b97d-553795d7737d
	- ```go
	  func TestBuy(t *testing.T) { t.Parallel() b := bookstore.Book{ Title: "Spark Joy", Author: "Marie Kondo", Copies: 2,} want := 1 result := bookstore.Buy(b) got := result.Copies if want != got { t.Errorf("want %d, got %d", want, got)}}
	  ```
- s there any way, then, to write a function that can modify a variable we pass to it? For example, we’d like to write a version of Double that will actually have an effect on x when we call Double(x). Instead of just taking a copy of the value of x at the moment of the function call, we want to pass Double some kind of reference to x. That way, Double could modify the original x directly. #go/book/pointers
  ls-type:: annotation
  hl-page:: 116
  hl-color:: yellow
  id:: 65dae432-8f1a-45a7-b81b-4563a9e1d11d
- It means that we184 write code for human beings, not for computers. Those humans are fallible, impatient, inexperienced, inattentive, and in every other way imperfect. We can make their lives(and jobs) considerably easier by putting some thought into the design and detail of our Go code.
  ls-type:: annotation
  hl-page:: 184
  hl-color:: yellow
  id:: 65dae5bd-f590-49b6-802b-e9fee8a47212