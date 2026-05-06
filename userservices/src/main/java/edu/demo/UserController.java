package edu.demo;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/users")

public class UserController {
	@GetMapping("/{id}")
	public String getUser(@PathVariable int id) {
		return "User ID:"+id+"Name:Sai";
	}

}
