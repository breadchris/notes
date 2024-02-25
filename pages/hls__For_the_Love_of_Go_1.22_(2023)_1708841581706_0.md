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