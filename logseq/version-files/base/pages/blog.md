- #blog/post This is for Nolan
  collapsed:: true
- [[This is for Nolan]]
- [[teach yourself about ai]]
- [[I hacked my high school, and you should too]]
- [[AI Can't Fold 1000 Cranes]]
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
- #blog/post AI Can't Fold 1000 Cranes
  collapsed:: true
	- {{video https://youtu.be/hA1siXMbDiU?si=VulCz6cBhhfn-3bp}}
	- Folding 1000 origami cranes sounds at lot easier than it is. When my engineer mind latched onto the idea of completing this task, I was intrigued by the [foretold wish](https://en.wikipedia.org/wiki/One_thousand_origami_cranes) one would get in exchange for folding a bunch of the easiest origami models. Kids do this every year in Japan, how hard could it be?
	- On average, it would take me 5 minutes to fold a crane from start to finish. If you want to do that in a year, 1000 / 365 ~= 2.74. So if you assume you need to fold 3 a day, that is 15 minutes out of your day, every day, for a year where you are folding an origami crane. That is pretty straight forward. There are countless meetings or times when I could be on a call where I could pause, grab a piece of paper and knock one out. But the thing is, that 5 minutes is 5 minutes of pure focus.
	- In the age of automation, people have not been able to make a reliable origami folding machine, and there is a good reason. The dexterity that you need to be able to make something as "simple" as a crane, is actually quite impressive. Knowing how much delicate force to apply on the right place. Knowing to crease with your finger nail for a hard, definitive fold or your finger tip for a "non-committal" fold. (There is a cool video of someone using the [surgical robot arms to fold one](https://www.youtube.com/watch?v=x9Bjs99A0k0), but there is a still a human on the other end). Very quickly, you realize that a folding a crane is not a trivial task. Even if you wanted to rush it to make a "shitty" looking crane, that is still going to take time, and even more, with imprecise folds, you quickly find yourself unable to perform the next step. See, the folds in origami are deeply mathematical in nature. The paper is a finite, two dimensional plane and you are transforming the plane into irrational space. Being patient with every fold, and being careful of how folds are folded is very important for ending up with a well folded crane.
	- I decided to start folding after I went through a tough breakup at the beginning of January 2020. Over the course of the first year, I managed to only fold 800 of the 1000 I set out to make. It took me an additional 2 years to finish the last 200, so no wish lol. Every single one of those cranes captured a part of my day when I might have been bored and wanted something to do, a meeting where I needed something to do with my hands, a time where I felt sad about something and being able to bring myself to fold a crane was the little victory I needed. There were times when I would "rage fold", something around me was making me upset so I channeled all my anger into cranking out cranes. I think my rage folding record was like 15?
	- You also realize something about the reason about the origin of this tradition. Every year, people fold and bring [1000 cranes to the Hiroshima and Nagasaki](https://blog.nationalgeographic.org/2015/08/28/how-paper-cranes-became-a-symbol-of-healing-in-japan/). There is something deeply intimate about offering something that you spent at least 83 hours of your year doing. Every crane is a chance to meditate on what is happening around you. A time to accept yourself for what you have been capable of. A time to consider what you could be working on after you are done folding. Man, I would get terribly distracted when folding. I would often take a piece of paper, thinking I was going to fold it and then a few days later I would look at it and go "oh, right". But the thing is, it was ok. Why wouldn't it be? If I wanted my wish, I was going to have to work for it.
	- You truly have to be in a state of flow in order to get your wish. I am hesitant to say that this experience has "profoundly" changed me, but I can certainly say that this has reinforced what it means to have "small wins" every day, and the compounding effect that they can have. Someone told me that the reason the US Military is so strict on [making your bed neatly every day](https://www.youtube.com/watch?v=KgzLzbd-zT4) is to serve as a simple task that you can look back on and be proud of yourself that you have achieved. I find it very fitting that I made my bed before I started counting my cranes to see if I had gotten to 1000.
	- If you have never heard of this before, or maybe have and have been curious, I highly encourage you to [buy some origami paper](https://a.co/d/2Cbrikh) (you don't need to buy 1000, you can start with much less) and try to make just one crane. If you haven't folded on before, I guarantee that there will be some struggle, but push through! My love, Erin, who is an artist, had a rough first attempt, but got it right on the next few. Let you work surprise you. I am not recommending that everyone try to fold 1000 cranes, I think that task is too daunting. Instead, just have some origami paper laying around (or even grabbing some [printer paper and turning it into a square](https://www.youtube.com/watch?v=cMXzRBDFpGU)), play with it when you are bored. Check out [this youtuber](https://www.youtube.com/watch?v=6VqF8WGuBLA), I have been following them forever, and they are some of the best origami videos out there. Learn/try to teach with your partner, your kids, your friends, your family. Learning to fold a crane is something that is very subtly impressive and incredibly rewarding, in my opinion of course. I hope I was able to inspire you to try something new today!
- [[Start with a Static Site]]
  id:: 641f9021-a48c-462b-a3cd-768f86f38848
	- Ok, there is just simply way too much shit that you have to learn to host a freaking website . Let’s make that easier.
- [[A Sustainable Thinker Always Wins]]
- [[How I Got to Where I Am]]
- [[NYU Dropped the Ball]]
- [[I hacked your site]]
- [[We need Legos for Code]]
- [[Information About Gloving]]
- [[What holds us back]]
- [[Why soundbite should exist]]
	- Start with Markdown and hugo.  Markdown is trivial to learn and making a website is instant. Hugo is a single binary you download, run and boom there is your website. A number of themes are available for you to check out and play with, but they aren’t necessary to start out.
	- If you want to have more control over how things are formatted and roughly look, html will be the next step of learning. By itself, it will be relatively limited, but you can get pretty far with including a simple CSS style sheet like this one.
	- If you want to move things around on the page, make them bigger/smaller, red/blue. You are going to need to learn CSS. As you learn more about CSS, you should consider playing with css libraries like bootstrap or tailwindcss which will greatly scale up your abilities as you try to do more complicated and coordinated visual things.
	- When you want things on the page to move around things, you are going to want to learn Javascript. There is a lot that you can do with javascript. Understanding that a webpage is a tree of nested objects with names and identifiers will be important to spend time on. The internet will try to convince you that you need to know React, Angular, Vue, but you just don’t need it right now. These are javascript frameworks that really let you do some crazy things, but stay simple as long as you can. Once you find yourself needing to model a bunch of data on a page, I would recommending learning the javascript framework Svelte. Of all the frameworks, it is, in my opinion, the closest framework to the knowledge you already know about html, css, javascript.
	- If you have learned about html, css, and javascript, you are probably already building some cool things. You can still run the same hugo command and generate your website and not needing to think about much. But maybe you want to store data so it doesn’t go away when you refresh the page. If this is the case, you are going to want to build a backend. A backend is complimentary to your frontend as it runs as its own process and listens for requests your frontend sends to it. If you took my advice and learned Svelte, they have a super easy way to build a backend called SvelteKit. If you went with React, there is the great option of NextJS. If you haven’t learned either of these, you will probably want to learn about express and how to build REST api endpoints.
	- If you are feeling pretty good about all of this, then you are well on your way for some serious application development. These are the things that every application developer does every day at their company and you have your own foothold into this whole market. You are super valuable as a result. Look at all the things you know! You must have spent a ton of time looking at the internet for help on building these things and someone will pay for that. Good luck out there!
- #blog/post A Sustainable Thinker Always Wins
  collapsed:: true
	- You can think about a lot of different things all the time. Think about too many things and this becomes a serious problem, especially for those who have ADD. If you have a problem focusing on which idea to pursue, it is easy to experience the feeling of being lost. Life is happening, ideas come and go, but there is nothing for you to bring to show and tell.
	- I am not an expert in this field of study, but I do pay attention to what constitutes a “great thinker”. Or maybe a better term for the people I am thinking about is “sustainable thinker”.
	- ## Patience
	- A sustainable thinker is one who has, above everything else, patience. An idea will come and go, and it will not phase them. Instead, they take note of it. Often times a physical note, in a place that they frequently take their notes. There is organization to the way they take in information. Over time, these observations grow and connections are formed between new observations and older observations. Higher level concepts are synthesized. It becomes effortless to understand an entire domain of information. But it doesn’t stop there. To them this actually might be the beginning of what they consider “having an idea”. They take their hypothesis wherever they go. To the best of their ability, they will try to find data to suggest what they believe isn’t true.
	- ## Reading
	- A sustainable thinker reads. Often times long form text like books or insightful blogs. There is a purpose to how and what they read. But a very important point here is that these people are not machines that solely exist to consume well thought out content day in/day out. No, these are still humans who enjoy memes and bingeing mindless TV. See, a patient thinker understands the bigger picture. They are human on a planet of humans. Not everyone is like them, and so everyone has something to share. Being able to interact with actual humans through colloquial phrases and honest emotional communication is vital. Honoring the give and take of time and energy that comes with existing is paramount to a sustainable thinker.
	- ## Align with Sustainable Thinkers
	- I try to align myself with the patient thinkers I am fortunate enough to interact with. I find it an immense privilege to be able to ask questions of these people. It makes me feel rewarded to be able to provide well researched insight of my own to my peers.
	- I probably still have too many threads of thought I pull at every day, but I think I am on to something. I kind of have this master plan for what I am working on, but I also realize it will take time. I need to be patient and continue to be present and honest with myself. Through this practice, I have felt immensely rewarded even for doing the smallest of things, like writing a single note for a given day.
	- Regardless if you are or strive to be a sustainable thinker, I wish you all the best on your journey through your own mind
- #blog/post How I Got to Where I Am
  collapsed:: true
	- So i was in a really good high school [https://en.wikipedia.org/wiki/Poolesville_High_School](https://en.wikipedia.org/wiki/Poolesville_High_School) and so there would be some ridiculously smart people who would work on things and because the program was so close knit, information would disseminate between the grades and so the younger group of kids would only get that much better. I got involved in cyber security because the older kids competed in a competition that was for hacking and they did very well. So I strived to be like them and compete in competitions. Note that around this time CTFs were gaining traction, but hadn't quite got to the high schoolers yet. So the competition that I got brought up on was Brooklyn Polytechnic (now [https://en.wikipedia.org/wiki/New_York_University_Tandon_School_of_Engineering](https://en.wikipedia.org/wiki/New_York_University_Tandon_School_of_Engineering)) CSAW HSF (High School Forensics). It was a month long competition for high schoolers where the first round you had to spend a month looking at NCIS-like cyber forensics data online (go to fake website clones of facebook to look at someone's profile, they link to an image they took, image has EXIF data in it that has the next bit of evidence). So this competition was so cool that me and my friends were finalists for the competition. It was so cool, not only did you get an all expenses paid for trip to New york city to compete in finals, you got to also interact with all the other ridiculously smart finalists. They were from all over the country and they were all so cool that we ended up connecting our online social networks with them. A number of my friends today were finalists from that competition, including my roommate. They don't run this competition anymore because of politics, but I am trying to keep it alive with [https://github.com/CTFg/CTFg](https://github.com/CTFg/CTFg).
	- This jump started my social network so my friends and I were now networked with the best cyber security people in the US going into college. The college I went to had a cyber security lab (OSIRIS LAB, you have to play a CTF to get admission into the lab, it is pretty cool). It was a place to hang out between classes and work on cyber security stuff (like CTFs, hacking hardware, talking about semantics of programming) like some serious nerds here lol. There were leadership opportunities which meant that I could learn how to be better at organizing people to work on tasks together (which was something i enjoyed). One of those leadership opportunities was running the very same competition that I got into college with, HSF. I was able to take all of the things I learned while playing the competition, and implement them in a competition that every kid in America would get a chance to play with, how cool was that. The mentors that I had helping me put this together were top notch, some of the best roll models to follow in the footsteps of (they are all amazing people who live great lives).
	- I leveraged this lab's network to get me my internships. I worked at BAE systems for two years doing static code analysis to look for 0day vulnerabilities in a product they were using. I then got to intern at Uber which completely changed my life, once again.
	- Working at Uber let me see what choosing the "right" things really, really fast looked like. They were operating at such massive scale when I joined. The project I got hired onto only had a manager. Literally an intern and a manager. And together we built out the entire mobile security team. Our code is still run on every phone that has Uber downloaded and it is responsible for saving Uber the 20% of revenue that they lost to fraud. Millions and millions of dollars.
	- Understanding my impact to the world let me feel confident enough to join @Free Wortley (a coworker of mine from Uber) to work on Refinery. He derisked my decision to jump ship of a well paying job (without a college degree since I dropped out), to get paid way less, but on an opportunity that could change my life. We didn't use our security skills for the first product we were working on, so we changed to developing LunaDefend. This is a project was a work of love. It took the biggest problems that we saw at the other silicon valley companies in regards to security and solved it with this security framework. Unfortunately selling a dev tool is only something that you can do when you have hit a homerun of a product idea, and we just didnt quite get there. ...and then came the big one.
	- As I was walking out the door to go work from the day at free's, @alex told me about a chinese blog that was talking about a vulnerability in a widely used java library. I thought that was interesting, and drove off. Later that day Free and I were talking about what we could write about that might help us solve our SEO problem. What really cool blog post could we write about that would wow HN. I told Free about what alex had told me and we thought about it for a while. How many projects use Log4j? How hard is it to exploit this vulnerability? What could you do if you exploited this? ... wait minecraft kids are using this to crash servers with a chat box message? Could this really be as bad as we think it is? Are we living through the worst vulnerability that has ever happened to the internet?
	- Turns out, yes, we absolutely were experiencing this thing for real. While this wasn't actually a zero day (there was a version out with a fix) the communication of the vulnerability was lagging so hard that the chinese blog poster actually was looking at the github commit made to patch the vulnerability and writing about it on his own personal blog. This is what alex translated and read to me that morning. We poured over every single ounce of information that we could get our hands on. Pulling up the log4j code. Making a POC of the exploit. Our blog post had links to tweets that others had made.
	- Our blog post gets popular on HN, but it isn't the first result on the page. At the top was another blog post that someone had submitted. Looking at it, it wasn't really that clear as to what you were supposed to do to fix the issue. Our blog post had everything someone responding from it would have dreamt of. It was clear, concise and most importantly accurate. This quality of work earned us the opportunity of an HN mod replacing the top link of HN to ours.
	- Most importantly, we kept the blog up to date as more information became available to us through our vast social network that we now became in tune with. Asking the right questions and making the advice from the community as clear and actionable as possible.
- #blog/post NYU Dropped the Ball
  labels:: #security, #school
  collapsed:: true
	- ## How it went wrong
	- I have a pretty bad taste in my mouth with NYU after what they have done with CSAW over time. The fact that HSF became a CTF, quality went downhill, and then now non-existent is something that really bothers me. It had felt to me that there was a complete disregard for the exceptional talent pipeline that Nasir/Poly had established for continuing to build out cyber security at NYU. It feels disrespectful to all of the volunteers (you and I included) that worked so hard to not just maintain the quality of the program, but to make it 1% better every year, and make sure everything was in place for it to keep running.
	- The issue has stemmed from the push of making CSAW an international competition. The student volunteers were burdened with trying to handle this rapid expansion on the fly and the quality of the competition suffered. There was no longer anything "special" about CSAW since you can't have physical challenges when everything needs to be run in 10 different places. High school students and teachers all experienced this massive drop in quality and care for the competition. CSAW HSF, now CSAW RED, became a massive flop. NYU dropped their golden egg.
	- This was one of the reasons I decided to drop out of NYU. I was being offered a fantastic job at Uber, while having to fight to try to keep the security lab that special place that made it what it was. We weren't able to have a two time HSF finalist get accepted into NYU. Most finalists don't even consider going to NYU as they usually have their sights set on CMU, MIT, etc. A friend of mine, a three time finalist, only decided to go because he would be *paid* to go to NYU. Another friend would also have been paid, but decided to go elsewhere.
	- There is no competition on the planet that embraces the spirit of HSF (as it was). CTFs encourage a fire and forget mentality, once you have learned the patterns you need to learn. In fighting to preserve the HSF format, I was repeatedly told that HSF would not scale, and that was the reason why it became a CTF for highschoolers.
	- I wrote this challenge generator, partially out of frustration, to prove that it was possible to scale a competition that encourages cohesive problem solving skills. And even more importantly, it teaches students how to communicate the work that they have done and rewards them for spending that time. The ex-HSF finalists that I still stay in communication with, who remember how HSF was, are frothing at the mouth at the idea of this competition coming back.
	- My dream with rebooting HSF is to preserve the "magic" that you feel when you spend a week perusing the evidence, only to look at something for the 10th time and see what you were missing. Or being at finals and being given a phone and a "good luck". You were the one who showed me how special this competition was. We had facetime, as highschoolers, with real government agents doing this for a living.
	- I want to have a package that I can give to a community college that has a teacher that cares about cyber security, and show them how to run this for themselves. If we want to improve the cyber security talent pipeline, we have to fight to find those sleeping creative thinkers and give them a sanctuary to practice the dark arts of cyber security. NYU did not fight for this sanctuary, and the program suffered.
	- The reason I am so passionate about this competition is that it literally has made me who I am. When I applied to colleges, I applied to 13 colleges and only got into UMD and NYU. UMD gave me no scholarship money (even though I gave a presentation to the senior class of UMD's Cyber Aces program, sponsored by Northrup Grumman, on what it was like to intern there since I had interned at NG for two years). NYU didn't just give me money for being a finalist, but I talked to Joy (the year before she was let go) and she cared enough to make it remotely financially feasible for me to go there. CSAW brought the best high school/collegiate cyber security talent into the same room, for multiple days, every year. The roommates that I live with are HSF finalists. Because of CSAW, a national network of introverts has been solidified and is bringing the future of cyber security, and I reap the benefits of it.
- #blog/post I hacked your site
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
- #blog/post We need Legos for Code
  collapsed:: true
	- ## Playing with Legos
	- Legos are fun, they are [composable](https://en.wikipedia.org/wiki/Composability). Code is not composable, not at least in the way we learn to code
	- Different environments come with different constraints which end up with different code. Different ecosystems have different standards and ways to solve a problem.
	- Legos have been designed to have an incredibly rigid specification that has been upheld for many years. It is trivial to determine impostor bricks (I am looking at you Mega Blocks) from an actual Lego. They look wrong, they *feel* wrong, they are just simple not as fun to play with.
	- When something is possible, someone is going to do it. If someone has done it, then someone might come along and decide to continue to do it in a similar way. All successful programming languages have a following of individuals who follow standards outlined by the language. Whether they are rigid semantic properties that will cause your code to fail to compile, or ideas around how to name variables, people replicate what they see in code.
	- AI has shown us just how deeply rooted these lines of thinking are. The more patterns that emerge in code, the easier it is for an AI to replicate these patterns. The "clever" developer comes up with hack after hack and more often than not writes code which they are only capable of comprehending. Since these are "clever" solutions which demonstrate a deep understanding of the tool being used, an AI might have a harder time arriving at the same solution.
	- But with Legos, it is quite difficult to bend the rules. *Insert meme of stepping on lego*. I mean, they are physically quite hard and not designed to bend. As a result, those who play with Legos are much more capable of seeing, reverse engineering, and repeating patterns they see when building sets or looking at other's builds. There are no secrets, there are rarely any surprises, just consistent creative thinking.
	- ## [](https://github.com/breadchris/notes/blob/001dbbef6dc23ce5349baf7b39e98536da9270f1/pages/We%20need%20Legos%20for%20Code.md#legos-as-code) Legos as Code
	- It makes sense why we don't have coding Legos, it is really hard to build. We are constantly pushing the boundary of what computers are capable of doing every day. AWS, GCP, Azure, and I haven't used it but AlibabaCloud, these are all **massive** collections of code that are at the point where you have to play Jeopardy with them to figure out how to do the simplest of things
	- > 
	  "Chris, it is your board" "I will take '4 nines' for 100, please"
	  "'This service with a multi-character acronym made of a single letter is capable of holding a blob up to 5 TB in size and distributing it around the world."
	- With a Lego, you can always physically touch and see what a block is capable of doing. Short of showing up to a datacenter, I am not sure how I can physically interact with my data or code. I have to rely one documentation of features, trial and error to see what works or doesn't. It seems far too often I have to become an expert in an entire cloud technology before I actually reap the amazing benefits of it. All the while, I am probably burning cash in order to understand how the system works...
	- I teach high schoolers to code using [Scratch](https://scratch.mit.edu/). Scratch is a block based programming language where the blocks snap into each other. It is about as close to coding Legos as we can get, and my students love it. They come up with the most incredible programs, even those who would rather be still in bed at 8am in the morning. And where else do we see block based programming? Oh right, some of the largest video games in the world Minecraft and Roblox.
	- The thing is, we have written enough applications to know exactly [what is needed](https://supabase.com/) to take most ideas and scale them up to be legitimate businesses. Hell, Roblox is making *bank* off of children [building programs](https://www.roblox.com/create) in their ecosystem.
	- ## [](https://github.com/breadchris/notes/blob/001dbbef6dc23ce5349baf7b39e98536da9270f1/pages/We%20need%20Legos%20for%20Code.md#where-are-my-legos) Where are my Legos?
	- So what I am wondering is "Where are my Legos?".
	- You might be different than me, but it would be so cool if I could do the following and for it to "just work":
	- Open up my web browser and go to a coding site.
	- Write a single function that does something that I have done a thousand times (idk, some webscraper or something).
	- If my function depends on some other function, file storage, database, library, be able to easily connect that to my code in a way that I can use it (types, please for the love of god, I need types)
	- Send the function some data.
	- Call the function with some input data, verify my assumptions.
	- Click "deploy" and have the function be something that I can call remotely.
	- Configure the function to run on a schedule, when an event happens, etc.
	- If I like my code and I want to make it accessible for other people to start using, I want to formally define how to interact with my service by [defining a contract](https://grpc.io/).
	- All of this, by the way, could be made incredibly efficient to run too. With the dawn of [firecracker](https://firecracker-microvm.github.io/) serverless workflows can be spun up incredibly fast.
	- ## [](https://github.com/breadchris/notes/blob/001dbbef6dc23ce5349baf7b39e98536da9270f1/pages/We%20need%20Legos%20for%20Code.md#closing-remarks) Closing Remarks
	- We are in an age where so many problems that can be solved by code. CRUD apps that scale to thousands of users are trivial to write. The problem is the talent pipeline. Lessons being taught at bootcamps are not teaching sustainable programming. They aren't teaching people how to "code Legos". Companies that dictate bootcamp curriculum have tech stacks that are heavily dependent on code that has been written many years ago. Something as simple as writing untyped code spells disaster for any hope of writing code that could eventually be composable.
	- Anyways, I literally think about this every day and talk about it with friends in [my discord](https://discord.gg/QCVqvbpb) so if you are interested in learning more, please come and hang!
- #blog/post Information About Gloving
  collapsed:: true
	- Since the [EmazingLights site](https://web.archive.org/web/20220922232820/https://www.emazinglights.com/pages/learn-gloving) seems to be down. I have moved the information over here to keep it alive!
	- ## Start Gloving
		- Welcome to the Learn Gloving Center, the most extensive online resource out there for learning everything you need to know about gloving. Constantly being updated and contributed to by the world’s most knowledgeable glovers, this is your first and best resource for learning what you need to jump into the world of gloving.
		- **What Is Gloving?**
		- LED light gloves are the creative medium for light show artists and flow artists all over the world. Glovers use glove lights to create mind-blowing dance performances to the tune of their favorite music and to battle head to head with other glovers in competitions across the country.
		- At EmazingLights, we pioneer the art of gloving into a legitimate art form and competition. The gloving community is constantly growing and connecting in new ways every day.
		- **What You’ll Find Here:**
			- **[Selecting a Glove Set](https://web.archive.org/web/20220930063604/https://www.emazinglights.com/pages/selecting-a-glove-set):**Here’s everything you need to know about what goes into a glove set, what all the different accessories are and what best suits your personal needs for your first glove set.
			- [**Learn Gloving:**](https://web.archive.org/web/20220930063604/https://www.emazinglights.com/pages/beginner-gloving-tutorials) Basic beginner tutorials, explanations of different moves, tips videos and tutoring resources can all be found here.
			- **History & Culture***(coming soon)***:**This section has everything you might want to know about how gloving came to be and the basic foundations of gloving culture so you can learn everything about what it takes to be a glover.
	- ## Gloving Communities
	- | Network | Name | # Of Members | Short Description | Location URL |
	  |---|---|---|---|---|
	  | Facebook | Glover's Lounge | 19764 | World's Largest Gloving Forum | [https://www.facebook.com/groups/GloversLounge/](https://web.archive.org/web/20220930065221/https://www.facebook.com/groups/GloversLounge/) |
	  | Facebook | Light Academy | 2655 | Forum geared toward Gloving Education for all skill levels | [https://www.facebook.com/groups/1038008026261606/](https://web.archive.org/web/20220930065221/https://www.facebook.com/groups/1038008026261606/) |
	  | Facebook | Northern Lights | 4254 | Group for all gloving communities within the Northeastern United States | [https://www.facebook.com/groups/NLights/](https://web.archive.org/web/20220930065221/https://www.facebook.com/groups/NLights/) |
	  | Facebook | Portland Lights All Night | 1773 | Group for the Gloving Community in Portland, Oregon (USA) | [https://www.facebook.com/groups/go2thePLAN/](https://web.archive.org/web/20220930065221/https://www.facebook.com/groups/go2thePLAN/) |
	  | Facebook | 808 Gloving Community | 712 | Group for the Gloving Community from the islands of Hawaii (USA) | [https://www.facebook.com/groups/108559492564096/](https://web.archive.org/web/20220930065221/https://www.facebook.com/groups/108559492564096/) |
	  | Facebook | The Glover's Pit | 5354 | Forum for all Online Gloving Competitions & Battles | [https://www.facebook.com/groups/GloversPit/](https://web.archive.org/web/20220930065221/https://www.facebook.com/groups/GloversPit/) |
	  | Reddit | Festival Sub-reddit | 5000 | Festival Guide & Forum | [http://www.reddit.com/r/festivals](https://web.archive.org/web/20220930065221/http://www.reddit.com/r/festivals) |
	  | Facebook | Nor Cal Lights | 708 | Gloving Community for Northern California | [https://www.facebook.com/groups/679593552145775/](https://web.archive.org/web/20220930065221/https://www.facebook.com/groups/679593552145775/) |
	  | Facebook | Florida Gloving Community | 788 | Group for all Glovers from Florida, USA | [https://www.facebook.com/groups/246252528791368/](https://web.archive.org/web/20220930065221/https://www.facebook.com/groups/246252528791368/) |
	  | Facebook | Phoenix Gloving Community | 163 | Group for all Glovers from Phoenix, Arizona (USA) | [https://www.facebook.com/groups/340655572682212/?ref=br_rs](https://web.archive.org/web/20220930065221/https://www.facebook.com/groups/340655572682212/?ref=br_rs) |
	  | Facebook | Chroma Mode Swap | 5255 | Group for Sharing Color/Pattern Combos for the eLite Chroma | [https://www.facebook.com/groups/247403678759632/](https://web.archive.org/web/20220930065221/https://www.facebook.com/groups/247403678759632/) |
	  | Facebook | MWG - Mid West Gloving | 1703 | Midwest Gloving Community | [https://www.facebook.com/groups/320937464607897/?ref=br_rs](https://web.archive.org/web/20220930065221/https://www.facebook.com/groups/320937464607897/?ref=br_rs) |
	  | Reddit | Gloving Sub-reddit | 5000 | Reddit Gloving Forumn | [http://www.reddit.com/r/gloving](https://web.archive.org/web/20220930065221/http://www.reddit.com/r/gloving) |
	  | Facebook | Gloving Skype / Google+ Trades | 1012 | An Place to Trade Lightshows Online | [https://www.facebook.com/groups/492530310874264/?notif_t=group_added_to_group](https://web.archive.org/web/20220930065221/https://www.facebook.com/groups/492530310874264/?notif_t=group_added_to_group) |
	  | Facebook | The Sounds of Gloving | 1334 | A Place to Find Good Gloving Music | [https://www.facebook.com/groups/629810670438734/?ref=br_rs](https://web.archive.org/web/20220930065221/https://www.facebook.com/groups/629810670438734/?ref=br_rs) |
	- ## Tutorials
	- ### Beginner
	- #### Finger Tutting
	  collapsed:: true
		- Details
			- You may have seen this one around before. Finger Tutting is a popular dance style based around creating angles, shapes and boxes with your fingers practiced by many dance crews (Jabbawockeez, Les Twins, etc) and even some [celebrities](https://web.archive.org/web/20220922232829/https://www.youtube.com/watch?v=nfWlot6h_JM). For gloving, it’s an essential. Entire teams and styles are based around Tutting and every top glover integrates it into their show in at least a small way.
			- Every glover integrates Finger Tutting into their style.
		- Images
			- ![fingertutting-240x240_medium.gif](../assets/fingertutting-240x240_medium_1676589650742_0.gif)
			- ![fingertutting-240x240-themagicians_medium.gif](../assets/fingertutting-240x240-themagicians_medium_1676589659453_0.gif)
			- ![fingertutting-240x240-pacman_medium.gif](../assets/fingertutting-240x240-pacman_medium_1676589669065_0.gif)
		- Videos
			- {{video https://www.youtube.com/watch?v=-9N1UhWxU8s}}
			- {{video https://www.youtube.com/watch?v=u3TvoI-jGV4}}
			- {{video https://www.youtube.com/watch?v=fP-ERh8RXFo}}
		- Variations
			- Wave Tutting
			- Tutting
			- Creatures
	- #### Stacking
	  collapsed:: true
		- Details
		  collapsed:: true
			- Stacking is placing one hand on top of the other over and over again in different variations so it gives your hands a look like they’re being “stacked.” Stacking is one of a small number of concepts that has no clear origins in any other dance style. It’s a popular entry level gloving move as it’s easy to learn and build off of while also teaching you hand coordination, rhythm and isolation.
			- It’s a basic and it’s not hard to learn. It’s a great and easy way to learn hand coordination and is a small move that you can flawlessly integrate into transitions in your shows.
		- Images
		  collapsed:: true
			- ![stacking-240x240_medium.gif](../assets/stacking-240x240_medium_1676527457206_0.gif)
			- ![stacking-240x240-boo_large.gif](../assets/stacking-240x240-boo_large_1676527453282_0.gif)
			- ![stacking-240x240-bones_medium.gif](../assets/stacking-240x240-bones_medium_1676527438732_0.gif)
		- Videos
		  collapsed:: true
			- {{video https://www.youtube.com/watch?v=Pz-EuuG2wGk}}
			- {{video https://www.youtube.com/watch?v=yyItASXIQBc}}
			- {{video https://www.youtube.com/watch?v=nW9cd5yCL1o}}
		- Who Uses It
		  collapsed:: true
			- Mimik
			- Cypher
			- Boo
		- Variations
		  collapsed:: true
			- Platforming
	- #### Finger Roll
	  collapsed:: true
		- Details
		  collapsed:: true
			- The Finger Roll (technically known as the "Finger Wave") is the first gloving basic. It goes into every move and every style. The strength of your finger roll makes learning everything else easier as it also builds up finger strength.
			- The Finger Roll & Finger Wave are considered to be the most basic foundation of all Gloving techniques. The movement is used in lots of other concepts, and is essential to most Glovers
		- Image
		  collapsed:: true
			- ![fingerroll-240x240-animatedj_medium.gif](../assets/fingerroll-240x240-animatedj_medium_1676527420911_0.gif)
			- ![fingerroll-240x240-doctorhorrible_medium.gif](../assets/fingerroll-240x240-doctorhorrible_medium_1676527399436_0.gif)
			- ![fingerroll-240x240_medium.gif](../assets/fingerroll-240x240_medium_1676527409129_0.gif)
		- Videos
		  collapsed:: true
			- {{video https://www.youtube.com/watch?v=kH0kuym8z20}}
			- {{video https://www.youtube.com/watch?v=W1mwrHpua4M}}
		- Who Uses It
		  collapsed:: true
			- Mimik
			- Anti
			- Blitzen
		- Variations
		  collapsed:: true
			- Overhand Finger Wave
			- Infinite Finger Roll
			- Fingerstyles ‘Finger Roll’
	- #### Figure 8
		- Details
			- The Figure 8 is the up and down movement of your hands in a Figure 8 motion using the rotation of your wrists. The Figure 8 is an old-school classic. Not many glovers use it anymore, but it’s a great move for teaching wrist flexibility and hand movement.
			- It’s a great and simple way to teach your hands to follow one another and wrist motion.
		- Images
			- ![figure8-240x240-boo_medium.gif](../assets/figure8-240x240-boo_medium_1676527351988_0.gif)
			- ![figure8-240x240-fry_medium.gif](../assets/figure8-240x240-fry_medium_1676527330291_0.gif)
			- ![figure8-240x240_medium.gif](../assets/figure8-240x240_medium_1676527340373_0.gif)
		- Videos
			- {{video https://www.youtube.com/watch?v=tCICnGoLq7g}}
			- {{video https://www.youtube.com/watch?v=-xrwp-GNAC8}}
		- Who Uses It
			- Trippz
			- Boo
			- Mimik
		- Variations
			- Liquid Figure 8
			- Liquid 8
			- Split 8
	- #### Liquid
		- Details
			- Liquid is the following of one hand with another along a line so that your hand and body seem to move like flowing water. It’s the move that gives glovers “flow” and allows you to smoothly transition from one move to another. It’s an absolute gloving essential.
			- It’s another essential. You need it to transition from one move to another properly and to give your shows a real light show feel.
		- Images
			- ![liquid-240x240_medium.gif](../assets/liquid-240x240_medium_1676527300932_0.gif)
			- ![liquid-240x240-trippz_medium.gif](../assets/liquid-240x240-trippz_medium_1676527256114_0.gif)
		- Videos
			- {{video https://www.youtube.com/watch?v=kNsi3hlU8vs}}
			- {{video https://www.youtube.com/watch?v=xmlI9BhYHjQ}}
			- {{video https://www.youtube.com/watch?v=g3G08fY4bGw}}
		- Who Uses It
			- Stasis
			- Blitzen
			- Cypher
			- Teddy
			- Slayer
		- Variations
			- Advanced Liquid
			- Liquid Dancing
			- Liquid Tutting
			- Liquid Box
	- ### Intermediate
	- #### Digits & Finger Connections
		- Details
			- Digiting and Finger Connection is used to add a complex element to your show. This intricate move will allow you isolate fingers and create an connecting shapes, sequences, and transitions that will take your show to the next level.
			- Digits and Finger Connections are essential to developing your own flow, as well as providing you plenty of dexterity to work with when throwing a show.
		- Videos
			- {{video https://www.youtube.com/watch?v=o40BvUqzDn8}}
			- {{video https://www.youtube.com/watch?v=c7kO4GUs0vc}}
		- Who Uses It
			- Mumbles
			- Stvcks
			- Mimik
	- #### Whips & Tunnels
		- Details
			- Whips  & Tunnels helped define the light show movement in its earliest phases. Often considered a necessity in a performance, these moves are fast moving circles that are whipped out into your audiences point of view, leaving a spectacular trail that extends from yourself, to their melting face.
			- Whips & Tunnels are some of the foundations of light shows themselves. To really master the craft of gloving, you *need *these in your set of moves to really show off your speed and skill.
		- Images
			- ![Blitzen-Marshmellow-Alone-1_large.gif](../assets/Blitzen-Marshmellow-Alone-1_large_1676588064786_0.gif)
		- Videos
			- {{video https://www.youtube.com/watch?v=IOvd50fnfEY}}
			- {{video https://www.youtube.com/watch?v=oWaT2dHq0EM}}
			- {{video https://www.youtube.com/watch?v=V89M25ERu9o}}
		- Who Uses It
			- Stunna
			- Mimik
			- Panda
	- #### Dials
		- Details
			- Originally created by a glover named Rockstar, "Dialing" is the stacking and switching of individual fingers over one another, typically done in a symmetrical half-circle motion. The concept is almost always done with two fingers, but can get increasingly complex with implementation of all 10 fingers.
			- Dialing increases finger independence and is an incredibly versatile concept that can be used in almost any situation. Increasing your skills with dials opens up the door for so many more combos and ideas in your shows.
		- Images
			- ![Alex.-Dialing.gif](../assets/Alex.-Dialing_1676584676679_0.gif)
			- ![Outlaw--dials.gif](../assets/Outlaw--dials_1676590977971_0.gif)
		- Videos
			- {{video https://www.youtube.com/watch?v=USfnF6BYuGs}}
		- Who Uses It
			- Mumbles
			- Flow
			- Pinky
	- #### Wave Tutting
		- Details
			- Wave tutting is all about helping connect your tech to your flow movements. They allow you to transition between concepts without breaking the motion, adding them to your performance is what will create a more seamless set of movements for your viewer.
		- Videos
			- {{video https://www.youtube.com/watch?v=j0DBa-lbLao}}
			- {{video https://www.youtube.com/watch?v=r7hyyYKk_wU}}
	- #### Intermediate Finger Rolls
		- Details
			- So you've got the basics of the Finger Roll down. Are you ready to take the next step? Follow along to learn some new tricks to add to your arsenal, Intermediate Finger Rolls are all about taking what you know and flipping it on its head to add even more variety into your shows.
			- It's never enough to be satisfied with the basics. Learning more variations of the Finger Roll will allow you to separate yourself from the rest of the pack, and really give people something to look at when you're performing. It also helps teach you how to use both hands individually of each other, and allow you more strength & control over your move sets.
		- Videos
			- {{video https://www.youtube.com/watch?v=gX5ayBPJfpc}}
		- Who Uses It
			- Blitzen
			- Mimik
			- Anti
	- #### King Tutting
		- Details
			- King Tutting is a popular style that has integrated aspects of hip hop into light shows. Glover's tend to incorporate this style into their shows because it utilizes your arms and shoulders to create large angles, shapes, and boxes. Blend this style into your light shows to make better use of the grid around you.
		- Videos
			- {{video https://www.youtube.com/watch?v=j4SpxzF80Fk}}
			- {{video https://www.youtube.com/watch?v=pkpvM2AfvTc}}
			- {{video https://www.youtube.com/watch?v=3LU0UMOJL2M}}
		- Who Uses It
			- JBake
			- Panda
			- JayFunk
	- ### Advanced
	- #### Flails
		- Details
			- Initially created by Glovers like [PM] Cire & [TNT] Fry, Flails are quick circles that "flail around" from the point of your wrist, to create the illusion of one continuous circle. WIth some proper speed control & strength, flails can add a mesmerizing effect to your shows, and give you that "wow factor" when performing.
			- Flails are a common addition to most gloving light shows these days. They're simple to learn, and are a great piece to any performance. Learn this move to really show off your speed control and wow the viewer with circles for days!
		- Videos
			- {{video https://www.youtube.com/watch?v=0-BN7yahyKs}}
			- {{video https://www.youtube.com/watch?v=fexWgfyq11c}}
			- {{video https://www.youtube.com/watch?v=15xh4Jh9XLY}}
		- Who Uses It
			- Fry
			- Materia
			- Flow
	- #### Conjuring
		- Details
			- Popularized in Gloving by famous light artists like [PM] Munch, Conjuring is a style in which the glover utilizes the on/off functions of the light to create the illusion that the light is disappearing, teleporting, or changing in some way. Typically only a few lights are left on at a time and then transferred from finger-to-finger by clicking one light off and the other one on. The effect this gives is one of pure magic, as the glover is able to make lights disappear and reappear in a flash
			- Conjuring you gain knowledge of the viewers focal point, and they are also good practice for mode changes. One of the least practiced styles in gloving but one of the techniques that will amaze the casual audience.
		- Images
			- ![conjur-guy.gif](../assets/conjur-guy_1676584319040_0.gif)
			- ![conjuring-guy.gif](../assets/conjuring-guy_1676584329243_0.gif)
		- Videos
			- {{video https://www.youtube.com/watch?v=8NDNEwLViRA}}
		- Who Uses It
			- Munch
			- Warrior
			- Mez
	- #### Mode Switching
		- Details
			- Mode switching is the act of changing your mode to a different color and flashing pattern selection in the middle of a show by either clicking the buttons on the lights, or an accelerometer trigger. Mode changing is effective for accenting speed control, like when glovers switch to a blinky set during slow, more technical times, and switching to a much more trail inducing set during faster motions.
			- Mode changing keeps your viewer on the edge of their seat. Knowing how the modes on your lights are laid out is crucial for this technique, as you must be able to anticipate what’s coming next. Simple things like changing colors or patterns really introduce a wow factor for your viewers, as it is often unexpected.
		- Who Uses It
			- Flow
			- Materia
			- Ice Kream Teddy
	- #### The Grid
		- Details
			- A structured representation of the space in front of you. The Grid takes into account forward and backward, left and right, and up and down motions and sections them off equally into a 3D boxed pattern.
			- An absolute necessity for any glover. Knowledge of the Grid helps build spatial awareness and is used for accurate and precise placement of almost any move.
- #blog/post What holds us back
  collapsed:: true
	- I don’t know if I personally would say that my life has been “hard”. I hear people use this to describe their life; “I have fallen on hard times”. But I don’t know, it doesn’t seem to be a relatable feeling. I have had to solve “hard” problems. Whether it is a math problem with seemingly random symbols or trying to comprehend why my parents won’t get along with each other.
	- I think I would say my life has been “challenging” and I try my best to work every day to make it less challenging in certain ways so I can make room for challenges that I actually want. If something happens with a friend where we aren’t communicating well, I try my best to resolve this problem. I do this because I know I won’t be able to focus on writing the code I want. I want to be challenged by code, I don’t want to be challenged by emotions.
	- Fortunately for me, it seems that I  have a pretty good idea about how to tackle emotions. I like to think that I have been blessed by an innate ability to see and understand patterns, as well as having environments in my life that have made me feel safe and secure. In high school I was in an incredible school program for nerds, in college I was a part of a student run cyber security lab, I dropped out of school to work at Uber with Phds and other drop outs who all had incredible passion for the work they did. Ever since high school, I have been a part of at least one group who made me feel _seen_ for who I was.
	- When I talk at length with my friends and peers about how they are doing, I grow more and more surprised? shocked? with every conversation. It is obviously purely qualitative, but goddamn, it seems like everyone experiences some degree of depression? Even my friends who permanently have a smile on their face, same thing, some type of perpetual sadness.
	- I want to be very careful when addressing this because:
		- 1) I don’t want to seem oblivious, yes I see how much pain there is in the world
		- 2) Insensitive to people’s very real feelings of depression
		- 3) Make those reading this to feel like I am saying “haha you have depression and I don’t”. I am very sensitive to other’s feelings around me, and it makes me sad that others so close to me experience this.
	- The thing is I just simply don’t experience what people describe when they describe depression. It is sometimes hard to get out of bed in the morning, but it has never seemed “impossible” as people have described. Days haven’t passed where it feels like I have done “nothing important”. Reflecting on my life, I realize I have unintentionally been trying to solve these feelings for others my whole life. Most namely my parent’s. Playing counselor for their shouting matches has left me with two things: an intuitive ability to speak non-confrontationally, but also a deep complex I have around trying to solve other’s problems.
	- These things have significantly affected my life and being able to address feelings in a productive way has been something you can’t even begin to put a price on. This deep vulnerability however, has been something I have struggled with, most notably in regards to close friendships and romantic ones. I have fought really hard with myself to over come this, but at the end of the day the true force that got me out of these situations is simply one thing; my support system.
	- My friends, family, co-workers, even regular people I would see at boxing or the skate park. These are the people who showed me what love and respect should look like. Just before I went through a really tough breakup I was able to visit with a number of friends and what hit me, I’m talking a real “hitting me like a brick” scenario, was that how I feel around my good friends is how I should always be feeling. I feel safe and secure around these people, I can be myself, who made me feel _seen_. Well then why would I ever be around someone who wasn’t making me feel that way? The math just didn’t add up.
	- There is an amazing book that I try to get people to read. It is incredibly terse so I understand if you don’t want to read it. Bowling Alone by Robert Putnam looks at how social life in the US has changed over time. The TL;DR is that groups and physical spaces where people would congregate are significantly declining as people find their social connections becoming more digital. Sitting in front of the radio listening to cowboy westerns, became watching them on TV, and now you watch a new western every month on your phone. This may seem like an obvious point, but an important one. Digital relationships are different. You can’t get hugged from across the Internet in a way that someone from a support group could do if you break down crying. Deeply human activities like exercising are limited. It becomes a lot easier to bully a faceless victim with words, which in turn forces victims into safe spaces which almost inevitably become echo chambers of emotion. I said “different” for a reason. Digital relationships are not inherently bad. I have built many relationships from various chat rooms (granted I have always made it a point to meet with them physically, eventually). The most compelling argument for how a digital presence is actually incredibly positive can be found in this documentary about VR chat.
	- This pain I discover in so many people is what is holding us back. No, I am not trying be profound here, I am just stating a fact. How can we be collectively working towards “the perfect thing”, whatever that may be, when there is so much unaccounted pain day to day? Universally embracing mental health has become so painfully obvious to me as what we should be investing in understanding, and yet the research in the field of psychology is underwhelming. My girlfriend, who studied psychology, explained to me that there was this research who proved that the results of most psychology studies up until some point were not satisfactory. This single study essentially reversed decades of work. The study of psychedelics has been something that has interested me greatly. The ability to visualize these things that hold us back sounds so incredibly powerful to me and they are actually effective at curing depression! I’ll save my thoughts on this for another post, I think I should probably end this one 🤣
	- There is only one thing I want you to walking away from this post thinking about. I want you to think about the ways that you feel seen and what you do to make others feel seen. This might seem incredibly confusing, but just think about it next time you are in a group of friends. What does someone do that makes you feel good? Do they smile at you? Remember something important about you? Do you like the inside jokes you have with each other? Perhaps you realize you actually don’t feel seen by your friends. Maybe a friend says something that makes your chest tighten. Perhaps you realize you can’t share something important about yourself with everyone because people would laugh. I really believe if we want to start healing from the “things that hold us back” we have to be conscious about these things about ourselves. Good luck out there! Life is freaking hard man 🤣
- #blog/post Why soundbite should exist
  collapsed:: true
	- TL;DR soundbite is a podcasting platform, supercharged by advancements in content discovery, to connect with your friends and your community before international influencers.
	- Authenticity is a commodity in modern day communication. When we wake up, we look at our phone, during breakfast, we look at our phone, at work when we are bored, we look at our phone, going to the bathroom? phone. Watching TV? phone. Avoiding going to bed? phone. It is the first and last thing we look at every day.
	- What do we spend our day doing on the phone? Catching up with some celebrity, social media influencer, some random hair salon that cuts hair with fire. "The algorithm" is really good at what it does, and what it is doing is keeping you on the platform by any means necessesary. If you spend a second longer than usual fixated on a some guy lifting a lot of weight your digital content butler is going to start serving you videos of weightlifters. The faster the algorithm can glean information about your engagement with the content, the more it is able to zero in on what they can fill your limited attention span with before you get ripped away and placed in front of someone else's visually, auditorially engaging world built more and more just for you.
	- As a developer, I am enthralled with how effective this algorithm is. And what is even more interesting is just how simple it is to build. Every major social media platform has their own form of "short form content" available for you to use and the numbers speak for themselves. Or even better, don't look at the numbers, just start using it yourself and feel just how targeted you get by spending very little time on any platform (tiktok's is scary good).
	- In essence, we have invented digital crack. A pure refinement on what "engagement" is. The doom sayers will tell you it is mind control, and I will generally agree. Actually, I completely agree, but I personally like to think that all mind control has its applications in humanity in a way that actually benefits us. I guess it is just the teacher in me that wants to connect with students in interesting ways and any good teacher is trying to do this every day already. Unfortunately, engagement that comes from "Answer this and get some candy" or "spend more time on the assignment and get extra credit" is not very effective or it really only will work a couple of times before the gig is up. Engaging content really comes from one's ability to observe the student, understand their world, and then know what it is that you can say or do that will coax them into walking into your world and seeing what you have to offer. Creators on Tiktok, and the like, really can do this quite easily once they figure out the forumla (which is "shared" by other creators who they follow), and often times it is really just acting out the all too potent and powerful primal desires we have. Girls showing off their boobs, men flexing, violence, romance, comedy, etc. Well, I should really say this type of content is what will go viral. There is so much content being uploaded to these platforms it is easy to miss the true home grown creativity that people, deep down, really do crave. The unapologetic, authentic content that comes from creators who care about their content and not the views it might have. When people get the creative freedom they crave, magic is made.
	- I have made an observation of my surroundings that has become undeniable to me, and I walk into every conversation I have with this thought banging around in my head. No matter who I am talking to, I am finding myself realizing that there are nuggets of valuable information that are constantly being dropped. A good conversation is one that seems to effortlessly till someone's mind and surface a part of them that they might not have talked about in a while. With the right questions, you can guide someone through their own mind and remind them about concepts and ideas that make them, them. And someone being themselves is not an easy thing to do. There is a lot of life that is lived between then and now. All of that time in between might be filled with things that seem insignificant to the speaker, but to the listener, that might be exactly what they need to experience to alter their perception fo the world. 
	  I think almost everyone has had this experience, but think back to a classroom experience you had with a "bad teacher". A "bad teacher", in my opinion is simply a teacher who just couldn't connect with you in the way that you needed to be connected with. Now, and hopefully you have had this experience, a "good teacher" is one who just always seems to say the things that make you consider what they are talking about for a moment longer. The information percolates throughout your mind and starts to alter your assumptions. Finding the right teacher for you can be incredibly difficult. Someone who can speak your language, not just English, Spanish, Chinese, etc. but the colloquial words you have come to speak so that you can feel seen for who you are, that can be difficult.
	- The case for soundbite begins and ends with a simple idea; we need to feel seen before we can learn. There is so much stimulation around us digitally that the next wave of advancements in communication are going to feel like regressions in technology, but in reality they are focused on solving the much more complicated problems that we, as humans and not just consumers, face.
- #blog/draft Quality is undeniable
	- <list of things that people touch for the first time and understand what quality feels like like a sharp knife cutting through something>
- #blog/draft Notetaking is building your own language
	- <brief history of language and how it is used to index information so you can express it to others>
	- When we take notes, we remember things in certain ways.
	-