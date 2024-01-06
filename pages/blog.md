- #blog/post This is for Nolan
  collapsed:: true
	- ## SOLID principles
	- The set of five design principles for object-oriented programming that were first introduced by Robert C. Martin. These principles are intended to make software designs more understandable, flexible, and maintainable.
	- In Go, the SOLID principles can be applied as follows:
	- ### Single Responsibility Principle (SRP)
	- Example:
	  
	  ```go
	  type UserService struct {
	    userRepository UserRepository
	  }
	  
	  func (us *UserService) CreateUser(user *User) error {
	    return us.userRepository.Create(user)
	  }
	  
	  func (us *UserService) GetUserByID(id int) (*User, error) {
	    return us.userRepository.GetById(id)
	  }
	  ```
	  
	  In this example, the `UserService` has a single responsibility - to manage user-related operations. It does not have any knowledge of the underlying storage mechanism for the user data - this is delegated to the `UserRepository` interface.
	- ### Open/Closed Principle
	- Example:
	- ```go
	  type Shape interface {
	  Area() float64
	  }
	  - type Rectangle struct {
	  Width  float64
	  Height float64
	  }
	  - func (r *Rectangle) Area() float64 {
	  return r.Width * r.Height
	  }
	  - type Circle struct {
	  Radius float64
	  }
	  - func (c *Circle) Area() float64 {
	  return math.Pi * c.Radius * c.Radius
	  }
	  ```
	- In this example, we define a `Shape` interface that defines an `Area()` method. The `Rectangle` and `Circle` structs both implement this interface, and provide their own implementation of the `Area()` method. Now, if we want to add a new shape, we can simply create a new struct that implements the `Shape` interface without having to modify the existing code.
	- ### Liskov Substitution Principle
	- Example:
	- ```go
	  type Animal struct{}
	  - func (a *Animal) Speak() string {
	  return "Animal sound"
	  }
	  - type Dog struct {
	  Animal
	  }
	  - func (d *Dog) Speak() string {
	  return "Woof!"
	  }
	  - type Cat struct {
	  Animal
	  }
	  - func (c *Cat) Speak() string {
	  return "Meow!"
	  }
	  ```
	- In this example, the `Dog` and `Cat` structs inherit from the `Animal` struct. However, they each provide their own implementation of the `Speak()` method. By adhering to the LSP, we should be able to use an instance of `Dog` or `Cat` wherever we would have used an instance of `Animal` without modifying the behavior of the program.
	- ### Interface Segregation Principle
	- Example:
	- ```
	  type Animal struct{}
	  - func (a *Animal) Speak() string {
	  return "Animal sound"
	  }
	  - type Dog struct {
	  Animal
	  }
	  - func (d *Dog) Speak() string {
	  return "Woof!"
	  }
	  - type Cat struct {
	  Animal
	  }
	  - func (c *Cat) Speak() string {
	  return "Meow!"
	  }
	  ```
	- In this example, the `Dog` and `Cat` structs inherit from the `Animal` struct. However, they each provide their own implementation of the `Speak()` method. By adhering to the LSP, we should be able to use an instance of `Dog` or `Cat` wherever we would have used an instance of `Animal` without modifying the behavior of the program.
	- Interface Segregation Principle (ISP):
	- Example:
	- ```go
	  type UserRepository interface {
	  Create(user *User) error
	  GetById(id int) (*User, error)
	  }
	  - type PasswordRepository interface {
	  CreateHash(password string) (string, error)
	  ValidatePassword(hash, password string) error
	  }
	  ```
	  In this example, we have two distinct interfaces - `UserRepository` and `PasswordRepository`. Each interface is specific to a particular responsibility - one for managing user-related operations, and one for managing password-related operations. This is preferable to having a single, monolithic interface that attempts to cover both responsibilities.
	- ### Dependency Inversion Principle
	- Example:
	- ```
	  type Animal struct{}
	  - func (a *Animal) Speak() string {
	  return "Animal sound"
	  }
	  - type Dog struct {
	  Animal
	  }
	  - func (d *Dog) Speak() string {
	  return "Woof!"
	  }
	  - type Cat struct {
	  Animal
	  }
	  - func (c *Cat) Speak() string {
	  return "Meow!"
	  }
	  ```
	- In this example, the `Dog` and `Cat` structs inherit from the `Animal` struct. However, they each provide their own implementation of the `Speak()` method. By adhering to the LSP, we should be able to use an instance of `Dog` or `Cat` wherever we would have used an instance of `Animal` without modifying the behavior of the program.
	- ### Interface Segregation Principle (ISP):
	- Example:
	- ```go
	  type UserRepository interface {
	  Create(user *User) error
	  GetById(id int) (*User, error)
	  }
	  - type PasswordRepository interface {
	  CreateHash(password string) (string, error)
	  ValidatePassword(hash, password string) error
	  }
	  ```
	  In this example, we have two distinct interfaces - `UserRepository` and `PasswordRepository`. Each interface is specific to a particular responsibility - one for managing user-related operations, and one for managing password-related operations. This is preferable to having a single, monolithic interface that attempts to cover both responsibilities.
	- ### Full Example
	- Here is an example of a Go program that applies the SOLID principles:
	- ```go
	  package main
	    import "fmt"
	    // Single Responsibility Principle:
	    // Each struct has only a single responsibility.
	    // User struct represents a user in the system.
	    type User struct {
	        ID        int
	        FirstName string
	        LastName  string
	    }
	  - // UserService struct defines a service for managing users.
	    type UserService struct {
	        users []User
	    }
	    // AddUser adds a new user to the service.
	    func (s *UserService) AddUser(u User) {
	        s.users = append(s.users, u)
	    }
	    // GetUserByID returns the user with the given ID.
	    func (s *UserService) GetUserByID(id int) User {
	        for _, u := range s.users {
	            if u.ID == id {
	                return u
	            }
	        }
	        return User{}
	    }
	    // Open/Closed Principle:
	    // The UserService is open for extension, but closed for modification.
	    // We can add new functionality by implementing new interfaces,
	    // rather than modifying the existing UserService.
	    // UserRepository defines the interface for a user repository.
	    type UserRepository interface {
	        SaveUser(u User) error
	        FindUserByID(id int) (User, error)
	    }
	  - // UserRepositoryImpl is a concrete implementation of the UserRepository interface.
	    // It uses the UserService to store and retrieve users.
	    type UserRepositoryImpl struct {
	        userService *UserService
	    }
	    // SaveUser saves a user to the repository.
	    func (r *UserRepositoryImpl) SaveUser(u User) error {
	        r.userService.AddUser(u)
	        return nil
	    }
	    // FindUserByID finds a user with the given ID in the repository.
	    func (r *UserRepositoryImpl) FindUserByID(id int) (User, error) {
	        return r.userService.GetUserByID(id), nil
	    }
	    // Liskov Substitution Principle:
	    // The UserRepositoryImpl should be substitutable for the UserRepository interface.
	    // This means that we should be able to use either the interface or the concrete implementation
	    // without knowing which one we are using.
	    // UserController is a controller for managing users.
	    // It uses a UserRepository to store and retrieve users.
	    type UserController struct {
	        repository UserRepository
	    }
	  - // NewUserController creates a new UserController.
	    func NewUserController(r UserRepository) *UserController {
	        return &UserController{repository: r}
	    }
	    // CreateUser creates a new user.
	    func (c *UserController) CreateUser(u User) error {
	        return c.repository.SaveUser(u)
	    }
	    // GetUserByID gets the user with the given ID.
	    func (c *UserController) GetUserByID(id int) (User, error) {
	        return c.repository.FindUserByID(id)
	    }
	    func main() {
	        // Dependency Inversion Principle:
	        // The UserController depends on the UserRepository interface,
	        // rather than on the concrete UserRepositoryImpl.
	        // This allows us to use any implementation of the UserRepository interface with the UserController.
	        
	        userService := &UserService{}
	        repository := &UserRepositoryImpl{userService: userService}
	        controller := NewUserController(repository)
	        user := User{ID: 1, FirstName: "John", LastName: "Doe"}
	        controller.CreateUser(user)
	        retrievedUser, _ := controller.GetUserByID(1)
	        fmt.Println(retrievedUser)
	    }
	  ```
	- In this example, the `User` struct represents a user in the system and has only the data and methods that are related to a user. The `UserService` struct defines a service for managing users, and follows the Single Responsibility Principle by having only a single responsibility (managing users).
	- The `UserRepository` interface and the `UserRepositoryImpl` struct demonstrate the Open/Closed Principle by defining an interface that can be implemented by different types, rather than modifying the existing `UserService`. The `UserRepositoryImpl` also satisfies the Liskov Substitution Principle by being substitutable for the `UserRepository` interface.
	- Finally, the `UserController` struct applies the Dependency Inversion Principle by depending on the `UserRepository` interface, rather than on a specific implementation of the interface. This allows us to use any implementation of the `UserRepository` interface with the `UserController`. For example, a memory implementation of `UserRepository` could be used in unit tests and a real database implementation of `UserRepository` could be used in integration tests using test containers.
	- To summarize, the SOLID principles are a set of design principles for object-oriented programming that can help to make software designs more understandable, flexible, and maintainable. In Go, these principles can be applied by using structs, interfaces, and other language features to create modular, decoupled code that is easy to understand and extend.
	- Personally, following these principles have helped me to maintain a well tested, 50k+ line solo project.
	- Hope this was a useful read!
	- ## Questions
	- > Does this still fulfill SOLID, if `UserService` is removed (by moving the `UserService` logic to `UserRepository`)?
	- In this specific example it wouldn't explicitly violate any principles, but if you were using a real database you'd want to abstract the database queries away so that data access implementation details don't leak into your business logic.
	- To illustrate using the example above, let's remove the `UserService` logic and move it to `UserRepositoryImpl`:
	- ```go
	  var ErrUserNotFound = errors.New("user was not found")
	  - // Open/Closed Principle:
	  // The UserService is open for extension, but closed for modification.
	  // We can add new functionality by implementing new interfaces,
	  // rather than modifying the existing UserService.
	  // UserRepository defines the interface for a user repository.
	  type UserRepository interface {
	    SaveUser(u User) error
	    FindUserByID(id int) (User, error)
	  }
	  - // UserRepositoryImpl is a concrete implementation of the UserRepository interface.
	  // It uses an explicit users slice
	  type UserRepositoryImpl struct {
	    users []User
	  }
	  // SaveUser saves a user to the repository.
	  func (r *UserRepositoryImpl) SaveUser(u User) error {
	    s.users = append(s.users, u)
	    return nil
	  }
	  // FindUserByID finds a user with the given ID in the repository.
	  func (r *UserRepositoryImpl) FindUserByID(id int) (User, error) {
	    for _, u := range s.users {
	        if u.ID == id {
	            return u, nil
	        }
	    }
	  - return User{}, ErrUserNotFound
	  }
	  ```
	- This looks fine, functionality stays the same and we removed 17 lines of code, but let's add a few things.
	- What if we want to check if a user exists before saving it? We can do so with the following:
	- ```go
	  // SaveUser saves a user to the repository.
	  func (r *UserRepositoryImpl) SaveUser(u User) error {
	    for _, user := range s.users {
	        if u.ID == user.ID {
	            return ErrUserWithIDExists
	        }
	    }
	  - s.users = append(s.users, u)
	    return nil
	  }
	  ```
	- As our user base grows, maybe we want to add a unique `username` field to the `User`. We can add the field to the `User` struct and on save check if the username is unique and doesn't contain any bad words.
	- ```go
	  var ErrUsernameExists = errors.New("user with username already exists")
	  - type User struct {
	    ID        int
	    FirstName string
	    LastName  string
	    Username string
	  }
	  - // SaveUser saves a user to the repository.
	  func (r *UserRepositoryImpl) SaveUser(u User) error {
	    if badWords.Contains(u.Username) {
	        return ErrUsernameInvalid
	    }
	  - for _, user := range s.users {
	        if u.ID == user.ID {
	            return ErrUserWithIDExists
	        }
	  - if u.Username == user.Username {
	            return ErrUsernameExists
	        }
	    }
	  - s.users = append(s.users, u)
	  - return nil
	  }
	  ```
	- Now if we wanted to rewrite SaveUser using an actual database:
	- ```go
	  // SaveUser saves a user to the repository.
	  func (r *UserRepositoryImpl) SaveUser(u User) error {
	    if badWords.Contains(u.Username) {
	        return ErrUsernameInvalid
	    }
	  - users := r.db.Query("select * from users").ScanStructs(User{})
	    for _, user := range users {
	        if u.ID == user.ID {
	            return ErrUserWithIDExists
	        }
	  - if u.Username == user.Username {
	            return ErrUsernameExists
	        }
	    }
	  - return r.db.Exec("insert into users(id, first_name, last_name, username) values (?, ?, ?, ?)", u.ID, u.FirstName, u.LastName, u.Username)
	  }
	  ```
	- Still maintainable but it could look something like this which I personally find more readable:
	- ```go
	  func (r *UserRepositoryImpl) SaveUser(u User) error {
	    if badWords.Contains(u.Username) {
	        return ErrUsernameInvalid
	    }
	  - users := r.repository.QueryAllUsers()
	    for _, user := range users {
	        if u.ID == user.ID {
	            return ErrUserWithIDExists
	        }
	  - if u.Username == user.Username {
	            return ErrUsernameExists
	        }
	    }
	  - return r.repository.SaveUser(u)
	  }
	  ```
	- You could refactor even further:
	- ```go
	  func (r *UserRepositoryImpl) SaveUser(u User) error {
	    err := r.repository.ValidateUser(u);
	    if err != nil {
	        return err
	    }
	  - return r.repository.SaveUser(u)
	  }
	  ```
	- Now it's even more clear what the code does: validate the input then save. By abstracting the implementation away from the intention, you can read more immediately know what SaveUser is supposed to do. And when you want to know how user validation or saving the user actually works, you can navigate to the definition at that point.
- #blog/post i hacked your site
  collapsed:: true
	- It isn't your fault, you were just doing your job. Even if you wanted to try to stop it, there isn't much you, as an individual, could do about it. Either I or someone else who vaguely understands how to code was going to hack you like this. Business requirements for shipping that feature out at lighting speed for your largest customer last quarter made this all too easy.
	- ```js
	  const asdf = () => {}
	  ```
	- Your company's site uses javascript. It has a package.json that's filled with dependencies. It is probably fair to say you are using at least one of the top 1000 most popular javascript packages. Go ahead, find one that you use:
	- select package -> package X
	- So let's take a look at package X. It has N lines of code and is maintained by M number of maintainers. But wait, there is more. What about the packages package X depends on? Well, it turns out there are D of them. And if you were to consider all of the maintainers of those packages, there are M' of them. Pretty wild.
	- Why would you care about this? Well let me lay out a scenario.
	  Let's say I am a hacker that wanted to hack your company. Knowing that your company's site uses package X, I can have some fun with your site. If it isn't obvious, package X's code and all of packages it depends on code all have _full access_ to your site. That means they could run whatever code they wanted to. Credit card number is entered into a form? Sounds juicy. Maybe I just want to show all your users some dancing cats. I'm sure they would love that. Let's go and do that.
	- Well, most of package X and its dependencies have their code hosted on Github and I have fabricated what looks to be a reputable account here. Look at me, such an outstanding open source contributor.
	- One of the packages that X depends on is package Y.
	- Package Y has N open issues for bug fixes or feature requests and I am sure they could use some help with some code. I'll spend a few hours to work on some code to resolve issue # and I'll send it over to package Y's maintainers. It might look like this.
	- Fortunately I made quick work of this issue because I had a helpful library lying around that did most of the work for me. I feel like my changes are pretty reasonable and it would be a no brainer for a maintainer to accept this code. Maybe there are a few tweaks to make, but odds are pretty good I can get that code landed.
	- Cool, so when my code gets landed, the maintainer will cut a new release at some point and my code will be running in your company's site once you bump your version or blow away your package lock like you normally do.
	- What are the odds the maintainer actually looked at that dependency I added? How often do you spend a single second looking at the package you are about to include into your app? If you are a good developer, I would give you a minute of looking at the docs, API, maybe the tests. But have you _really_ scanned through all the files? Did you check the `scripts` section of `package.json`? I sure as hell don't do this for every package I install, let alone all the other packages it installs. How can I when my manager is breathing down my neck?
	- Ok, ok, lets say you really are the engineer of the year and you poked and proded my PR and checked out the source code for the library I added. If you haven't go ahead and look, I'll wait. I would expect that your search hasn't actually turned up anything that could be considered "malware". Maybe you found a bug, but errornous lines don't really matter to me when I am stealing passwords from your users.
	- The malicious code isn't in the source code, it's in _NPM_. Before I release a version of my dependency to the npm registry, I tack on a little more javascript. You would only see this javascript if you were to directly download the dependency and open it up (link). Didn't see that one coming did ya? I made the JS obvious here, but what if it looked more like this: xxx Is that easier to read?
	- You might laugh at this attack vector, "wow great, you are going to land some code and then a year from now when we bump our package version you can hack our site". Well, the thing is I already have spent a year doing this to your site. I fingerprinted the dependencies that your site has from your source maps and script tags. I've been resolving issues like this for the past year, and you don't have the slightest idea which dependencies are actually trojan horses for my exploit code.
	- "Why would I ever accept your PR? It includes an unnecessary dependency! If I were that maintainer, I would tell you to write those lines yourself." Well, if you think that way, you obviously aren't a javascript developer. Micropackages are [encouraged](https://www.chevtek.io/why-i-think-micro-packages-are-a-good-thing/). That is how development is done in Javascript land. In fact, take a look at this graph showing how many packages Package X has included over time:
	- Most Stack Overflow answers to Javascript developers has at least one person suggesting to use a package to fix the problem. Maybe I will start suggesting my own packages as answers to questions...
	- Oh also, this isn't hypothetical, [it has already happened](https://snyk.io/blog/a-post-mortem-of-the-malicious-event-stream-backdoor/). Bitpay was targeted by this attack, and the hacker was only caught because he called a deprecated function that node printed a warning about. Knowing how they got caught, only make my malware stronger.
	  It doesn't take an experienced hacker or really anyone with any security experience to do this. In fact, a regular developer would probably be more equipped that me to execute this attack because they probably know those weird forgotten about packages better than me.
	- You know what, next time I hack your site, I am not going to wait around for some developer to accept my PR. I wonder how hard it would be to find a developer who is down on their luck and offer them a good amount of money, a hard earned wage, in exchange for them including my library in their project to help me "get my feet off the ground" as a fellow developer applying for jobs.
	- We know this attack is happening, and us at LunaSec are building the future of protection from this type of attack. We aren't waiting around for some security researcher to raise the next alarm and deal with the fire drill of responding to these incidents. No, we are automatically _eradicating_ this problem by using our knowledge as security researchers _and_ developers to design an intelligent, automated system that silently protects you and your company's code.
- #blog/post I hacked my high school, and you should too
  collapsed:: true
	- I have worked for Northrup Grumman and Uber as a security engineer and I built security tools that have been used around the world. The coolest thing that I have done in my life is that I got to help develop code that ran on every device that had Uber installed on it. The purpose of this code was to help the [20% Uber was losing to fraudulent trips](https://www.cnet.com/culture/uber-fights-off-scammers-every-day-heres-how-it-learned-the-tricks/). The talent needed to work on a project like this was so rare that I was hired on as the first team member, as an intern and later hired on as a college dropout. This is not to toot my own horn, but it is to make a point: being a "hacker" is rare and it might be one of the most powerful skills in the age of computers.
	- I am going to show you, verbatim, of what I wrote when I graduated high school. No one else knew about this besides who might have, allegedly, worked with me. An important note on this, this all happened before I knew that cyber security competitions existed.
	- ## How I hacked my school
	- ### Fucking Cool Stuff
	  
	  So with these stories, I am entrusting you with our wrong doings at PHS and if you choose to tell others about these shenanigans I would appreciate you use anonymity as a member of our team is still in PHS and I would rather the word not have a chance of spreading and the person getting in trouble haha thanks.
	- #### **Part 1 - Getting Administrative Access on All the Computers In the School**
	  
	  So in Windows, to be able to change everything about the operating system, your user account must have the privileges of an Administrator user. Our student accounts are pretty limited, only allowing us access to certain programs and saving and opening files in a pretty restricted area on the computer. Naturally, we wanted to get complete control of the computers because we were bored haha. Before they upgraded the computers to Windows 7, this process was pretty easy. So we knew about a way to get the next best thing to the computer’s password and that is the password hashes using a tool called Ophcrack (Appendix A 7). A password hash is better explained here: [http://stackoverflow.com/questions/1602776/what-is-password-hashing](http://stackoverflow.com/questions/1602776/what-is-password-hashing) but it is basically a way to store a password on a computer so that if someone were to find the password hash on the computer (like we did) they would not just be able to read the password like they would read plain text (so instead of a computer storing “password” as the user’s password on the computer, they would be storing “5f4dcc3b5aa765d61d8327deb882cf99” (if they were using the MD5 hashing algorithm (there are a lot of different hashing algorithms that generate different combinations of numbers and letters, MD5 is just one of them))). So in order to use Ophcrack, we changed the computer’s BIOS (You know when you turn on your computer and you see like “Press f2” or something like that? If you press f2 when the computer is booting up you can change your own comuter’s bios settings :D) ([http://computer.howstuffworks.com/bios.htm](http://computer.howstuffworks.com/bios.htm)) so that when the computer was looking for an Operating system to boot into, it would first look at the flash drive that we had attached to the computer and checked if they flash drive had an Operating system on it (Ophcrack is considered a linux operating system based off of the Debian distrobution). Once the computer recognized our attached USB as having Ophcrack, Ophcrack would then be able to scan for the place on the hard drive where Windows stores its password hashes (Ophcrack is able to do this without worrying about not have the right permissions to access the passwords because it is using Linux and Linux has a different way it handles permissions and thus it completely ignores any permissions that the Windows operating system has on its files :D pretty cool huh?). So once Ophcrack gave us the password hashes we needed, we did this thing called a Rainbow Table lookup (no we are not checking to see if the passwords are gay or not haha). You can read more about rainbow tables here: [http://kestas.kuliukas.com/RainbowTables/](http://kestas.kuliukas.com/RainbowTables/) but basically since the password hashing algorithm will give vary different output in a small difference in the password (try it for yourself: [http://www.miraclesalad.com/webtools/md5.php](http://www.miraclesalad.com/webtools/md5.php)) it is impossible to simply deduce what the password is when you are only given the hash. Rainbow tables effectively break password hashing for fairly simple passwords (ie if there are only letters and numbers and it is smaller than 14 characters) because they are made in order to associate a specific password it a correlating hash (so these rainbow tables have the hash for password, password1, password2, password3, … and the person with the password hash only needs to find where their hash is in the table and get the password that it is associated with). Because this is MCPS, they do not have good password security and thus we found the password as a 6 digit alphanumeric string (alphabet and number characters only). And because the admin password is the same on all the computers, we had admin access on every single computer and had full control over all of them :D
	- #### **Part 2 - Dealing with the Windows 7 upgrade**
	  
	  So MCPS got a little smarter when they upgraded their OS from XP to 7 because they password protected the BIOS so that we were not able to change it (They also changed the admin password so our old one did not work). This did not stop us however :D So we did some research and discovered that the BIOS is really just a part on the computer’s motherboard that has to always be kept on (if you knew electrical engineering this would make sense due to the actual hardware logical gates having to store electrical charges but CS people don’t really care about that stuff haha). So this part on the motherboard is powered by a small battery called the CMOS battery ([http://www.allabouthappylife.com/acer_ferrari_5000/acer_ferrari_5000_detach-rtc-battery.jpg](http://www.allabouthappylife.com/acer_ferrari_5000/acer_ferrari_5000_detach-rtc-battery.jpg)). If this battery were to lose power or be unplugged, any settings that were changed by the user in the BIOS would be reset (:D). So you could only guess how happy we  were to find this out. The next day we found an isolated computer lab, opened up a computer, pulled the battery out and put it back in then used Ophcrack to find that they still had a 6 character alpha numeric password (they never learn). And that was that :D
	- #### **Part 3 - The School’s Wifi Password**
	  
	  Our motive for this was pretty obvious, we saw there was a wifi access point and we wanted to use it :D So going about solving this problem, we had to think about the ways we could gain access to it. It was secured with WPA2 encryption and unlike previous versions of wifi encryption like WPA and WEP, WPA2 is able to be cracked. So we could not remotely get the wifi password, we would need physical access to a device. Our first thought was since every router that was broadcasting the wifi signal was connected to a central router that had the password we could attempt to go into the ceiling, attach a lan cable into the router in the ceiling (those white things with green blinking lights) and then locate the main router on the network and rest the password. There were two problems with this approach as first getting access to something in the ceiling was pretty conspicuous and if someone turned the corner and saw us, we would have a hard time explaining and then secondly we did not know if we could actually find out the pre existing password or if we would have to reset the password which would then cause Mrs.Hackey to be all like WTF someone changed the wifi password and then we could also be caught. So we needed a physical device that was not conspicuous to obtain that is using the wifi network. Our answer was in the Mac laptops as they were 1) connected to the wifi network and 2) able to be obtained in a classroom setting. So getting our hands on a macbook we discovered that you had to be admin on the macbook to view the wifi password so you know what we did? Made ourselves admin :D So with almost any OS you can reset the admin password if the security settings are not changed to prevent that (this is MCPS of course they did not set the right settings :D) so we did this [https://discussions.apple.com/thread/4913069?tstart=0](https://discussions.apple.com/thread/4913069?tstart=0) **boom **logged in and got the password **snap** :D
	- #### **Part 4 - Getting access to all of the security cameras**
	  
	  So you can see our collection of images in Appendix A 8 (it is not complete because there are different models of cameras and the program we made did not account for the authentication method for the other model of camera so we were not able to get all the cameras but this is still a pretty good list :D). So this little project was a little more advanced in the sense that we had to use our knowledge about computer networking to do what we wanted to do. So we figured that there was no way that the cameras were directly connected to like a central computer with wires because that would take up way too much wire so they were more likely connected to the routers scattered around the ceilings. And since the routers are all on the wifi network, that meant that the cameras were on it too. Now the tricky part in this is determining what subnet (or sub-network: [http://blog.codepath.com/2011/11/15/what-are-subnets/](http://blog.codepath.com/2011/11/15/what-are-subnets/)) all of the cameras were on. So when we connected our computers to the network, the network has to issue out IP addresses to our computers so it could identify our computers on the network and keep track of who was who. And since we were given IP addresses in the form 192.168.1.[0-255] we thought that maybe the cameras were in somewhere buried in another subnet like 192.168.2.0/16 or 192.168.3.0/16 (this will make more sense if you read the SANS thing on networking or do some Googling on subnets and i can answer any questions you have about them). So how we would check to see if the cameras were on a subnet is do this thing called a Ping Sweep. In a ping sweep we are essentially trying any possible combination of IP address in a particular subnet and issuing a Ping command on it. What ping is is a small message that is sent from one computer to another destination across a network in order to tell if something exists at that IP address. But in our attempts we did hear back from any of our ping requests and thus we concluded that there were no cameras on that subnet. After some time of experimentation we realized something important. So since the schools network is self contained, it is considered to be private. Private IPv4 addressing is explained here: [http://compnetworking.about.com/od/workingwithipaddresses/f/privateipaddr.htm](http://compnetworking.about.com/od/workingwithipaddresses/f/privateipaddr.htm) but what you need to know for this is that private IPv4 has 3 different subnets that it uses, 10.0.0.0, 172.16.0.0. and 192.168.0.0. When we connected our computers, we were on 192.168.0.0 but had not tested the other two subnets. So doing our Ping Sweep again, we found them. When our computer lit up with Ping responses from the 172.16.0.0 subnet, we were so siced. Now that we knew where they were, we needed access to them. We knew they were IQeye so we did some research as to how they worked. We found a document that would later, after we got access to the cameras, be pretty funny ([http://www.iqeye.com/sites/default/files/mcps_case_study.pdf](http://www.iqeye.com/sites/default/files/mcps_case_study.pdf)) as well as there being a login web page that could be accessed for each camera that authorized a user that had the correct username and password. After trying the default username and password, we were not successful and concluded that MCPS wasn’t entirely insecure. Doing some more research we hit the jackpot. We found a document ([https://media.blackhat.com/us-13/US-13-Heffner-Exploiting-Network-Surveillance-Cameras-Like-A-Hollywood-Hacker-WP.pdf)](https://media.blackhat.com/us-13/US-13-Heffner-Exploiting-Network-Surveillance-Cameras-Like-A-Hollywood-Hacker-WP.pdf_)which had found an exploit in the IQeye cameras that returned the username and password hash of the account which you used to log in. Performing this exploit gave us what we needed and we then proceeded to break the password hash which, whatdoyahknow, was an extremely basic password, “mcps_152.” 152, that was a familiar number, where had I seen that before? Talking with my team we realized that it was Poolesville’s school code. I had forgotten to metion earlier that in our Ping sweep, we did a sweep of the entire 172.16.0.0 subnet and got hits in every subnet (so we found cameras in 172.16.1.0, 172.16.2.0, 172.16.3.0, etc…) so it would only make sense that each of those subnets had another school’s security cameras in them and their password was in the form “mcps_” plus the school code. Instead of trying to find every school’s school code, we just tried every password combination (that is we tried mcps_1, mcps_2, mcps_3, …, mcps_999). We automated this of course so we got it done in a matter of seconds so it was no big deal. So at this point we had access to every single camera in the entire county :D
	- ## No internet for you!
	- I had so much fun doing that.
	- Once competitions started, they were really fun competitions, but none of them really hit like the adrenaline that you got when you figured out how to hack the next thing in real life. With competitions, breaking out of the box is fun, but the stakes just aren't that high.
	- High school "content filtering", is more like "child surveillance" now that more powerful internet filters are available, the ethics of which [are questionable](https://elestoque.org/2022/10/07/uncategorized/deconstructing-securly/). There is so much of the Internet that you can't access and tools that you can use, it is insane. I recently spent a lot of time running into problems with this.
	- ### It is like NCIS, but for kids
	- I have run a cyber security competition recently where 200 students tried to forensically investigate a fictional murder mystery, whose evidence was on the internet. If you are interested in more details, here is a video about it:
	- {{video https://youtu.be/2AOxuHuHS1U?t=27}}
	- It is so much fun to run this. We just had our 7th year running this, and each year it has become easier because I have been writing a better [service to host it](https://github.com/ctfg/ctfg). Over the years, I have had high schoolers who competed end up helping me so the competition grew better and better every year. By hosting it at the local community college, we bring 200 students every year into a building that they could end up going to, and cemented in their minds as a place where they care about cyber security.
	- We ended up spending a ton of time trying to set the competition up in a way where the _very_ locked down systems that the students had were capable of accessing the competition site, and be able to solve the challenges. Given that this is a very real world competition, there are tools that the students need to use, but the computers are simply Chromebooks with very restrictive networks. When the competition started, our [wiki page](https://wiki.ctfg.io/) was not able to be accessed, the firewall was blocking it. Without access to this page, most students would not be able to progress. Anticipating that there would be problems like this, we built an entire virtual system that the students could use to access everything that they needed. It was really, really annoying to deal with.
	- ## Show some respect, the kids are hacking
	- If I was going to school right now, I would hack the living _shit_ out of these computers. We used to install [Halo](https://en.wikipedia.org/wiki/Halo_(franchise)) on every computer in a classroom so that we could have a LAN party and play with everyone.
	- Rodney Mullen, a world renown skateboarder, gave a TED talk on how [skateboarding was similar to hacking](https://www.youtube.com/watch?v=neOybMdWZbU). Skateboarding and hacking require a great deal of [flow](https://en.wikipedia.org/wiki/Flow_(psychology)). An insane amount of focus is needed to "do what you were not supposed to". Have you ever considered how the fuck the physics works on the shit people do when riding a [_rail_](https://www.youtube.com/watch?v=SnLoCkFdyvY)? Oh yeah, and kids are doing this. Every day, skateboarders invest their time, and literally their body, to honing in an intricate physics equations they can come up with in their head. If you don't believe me that skateboarding is important, it is literally in the [olympics](https://olympics.com/en/sports/skateboarding/).
	- Hacking is not just getting into unauthorized places like the movies will have you think, it is about doing something to show that you can do something crazy! You want to give someone that "holy shit, you just did that?" moment. I used to bring my own computer every day just so I didn't have have to deal with any restrictions from the school's computers. It was the only way that I could stay in my flow of hacking. If I had to deal with the insane restrictions on the school computers, I would actually just spend every second of my day thinking about how to bypass the ludicrous restrictions, and you aren't going to stop me.
	- ## Be realistic
	- If you impose crazy restrictions, you are going to make some insane hackers that you can't control. It is really that simple. What if I, as a professional security researcher, happen to end up doing some research about the very same security system you are using. I might post an anonymous post somewhere on the internet and a student ends up finding it. Very much in the same way that I learned how to hack the cameras.
	- It really isn't that hard, give students the tools that they need to play and they will be happy. My high school teacher literally manages his own server racks so that he can let his cyber class hack something. He wheels a massive server rack around his classroom because that is the best that he can do. Incredible! Help this man out! He is trying to teach cyber security! You need resources for that, damn.
	- If anyone who is a teacher, student, someone in charge of a school system reads this and wants to talk more about how to actually teach cyber security, I can help you. Don't make the same mistake NYU did: [[NYU Dropped the Ball]]. Hit me up on [twitter](https://twitter.com/breadchris).
- [[AI Can't Fold 1000 Cranes]]
- [[Start with a Static Site]]
  id:: 641f9021-a48c-462b-a3cd-768f86f38848
- [[A Sustainable Thinker Always Wins]]
- [[How I Got to Where I Am]]
- [[NYU Dropped the Ball]]
- [[I hacked your site]]
- [[We need Legos for Code]]
- [[Information About Gloving]]
- [[What holds us back]]
- [[Why soundbite should exist]]