

// The Skill class identifies an area of learning and is represented by a String
class Skill {
	skill_name;//String - name of this Skill
	constructor(name_of_this_skill) {
		if (typeof(name_of_this_skill).toLowerCase() != "string") {
			throw("ERROR - Skill constructed with non-string input");
		}
		this.skill_name = name_of_this_skill;
	}
}

// A number representing mastery of a Skill
class SkillLevel {
	value;//Number from 0 to 1, where 0 is no knowledge and 1 is perfect knowledge
	constructor(value_0_to_1) {
		if (isNaN(value_0_to_1)) {
			throw("ERROR - SkillLevel constructed with non-numeric value: " + value_0_to_1);
		}
		this.value = Math.max(0, Math.min(1, value_0_to_1));
	}
}

// Associates a Skill with a SkillLevel. These could be done simply as key-value pairs
// in a Dictionary, but we're doing super-vanilla JS and not importing such components.
class Ability {
	skill;
	skill_level;
	constructor(skill, level) {
		//if (typeof(skill) != "Skill") throw("ERROR - Ability constructed with non-Skill input: ");
		//if (typeof(level) != "SkillLevel") throw("ERROR - Ability constructed with non-SkillLevel input");
		this.skill = skill;
		this.skill_level = level;
	}
}

// A Student possesses a set of Skills and corresponding SkillLevels as key-value pairs
class Student {
	name;//String: Student's nickname (no PII)
	skillset;//Array of Abilities
	constructor(nickname, skills) {
		this.name = nickname;
		this.skillset = skills;
	}
	needs_help_with(skill, threshold) {
		for (var i = 0; i < this.skillset.length; ++i) {
			var ability = this.skillset[i];
			if (ability.skill.skill_name == skill.skill_name && ability.skill_level.value < threshold) {
				return true;
			}
		}
		return false;
	}
}

// A metadata object describing an academic exercise. I didn't want to implement
// Problems (with questions, solutions, etc.) since we're just concerned with the
// Skills involved, which might be part of such metadata.
class ProblemData {
	handle;//A nickname for the skill so we know that we found the correct one. E.G. "prob1"
	skills;//An Array of Skills that are exercised by the Problem represented
	constructor(handle, array_of_Skills) {
		// Assume I have included some type checking here too, or better yet, that I am
		// actually writing in a strongly-typed language and it wasn't necessary to
		// begin with.
		this.handle = handle;
		this.skills = array_of_Skills;
	}
}

// THIS IS THE WORKHORSE. A ProblemSet is composed of a set of ProblemData and can
// determine which of its associated problems should be presented to a given Student
// based on the student's Abilities.
class ProblemSet {
	problems = [];
	constructor() {
		// null constructor; we will push the data in piece-by-piece for now. Full
		// implementation would have an optional constructor arg to populate the
		// Object from the get-go.
	}
	
	//CONTRACT: new_problem is of type ProblemData
	add_problem(new_problem) {
		this.problems.push(new_problem);
	}

	//CONTRACT: 1. student is of type Student
	//				  2. problems is of length > 0
	//					3. threshold is of type SkillLevel
	find_best_problem_for_student(student, threshold) {
		var best_score = -1;
		var best_problem = this.problems[0];
		for (var i = 0; i < this.problems.length; ++i) {
			var prob = this.problems[i];
			var needed_skill_ct = 0;
			for (var j = 0; j < prob.skills.length; ++j) {
				var skill = prob.skills[j];
				if (student.needs_help_with(skill, threshold)) {
					needed_skill_ct++;
				}
			}
			if (needed_skill_ct > best_score) {
				best_score = needed_skill_ct;
				best_problem = prob;
			}
		}
		return best_problem;
	}
}

// Let's try this all out!

// Here are the Skills available
const add_fractions = new Skill("add-fractions");
const multiply_fractions = new Skill("multiply-fractions");
const add_decimals = new Skill("add-decimals");
const multiply_decimals = new Skill("multiply-decimals");

// Here is the ProblemSet
var problems_available = new ProblemSet();
problems_available.add_problem(new ProblemData("prob1", [add_decimals]));
problems_available.add_problem(new ProblemData("prob2", [add_decimals, multiply_decimals]));
problems_available.add_problem(new ProblemData("prob3", [add_fractions]));
problems_available.add_problem(new ProblemData("prob4", [add_fractions, multiply_fractions]));
problems_available.add_problem(new ProblemData("prob5", [multiply_decimals, multiply_fractions]));
problems_available.add_problem(new ProblemData("prob6", [add_fractions, add_decimals]));

// Here is the Student
var razorbat = new Student("RazorBat", [
	new Ability(add_decimals, new SkillLevel(.97)),
	new Ability(add_fractions, new SkillLevel(.17)),
	new Ability(multiply_fractions, new SkillLevel(.53))
]);

var next_problem = problems_available.find_best_problem_for_student(razorbat, 0.95);
console.log("For " + razorbat.name + ", we recommend: " + next_problem.handle);

var pumpkinofdoom = new Student("PumpkinOfDoom", [
	new Ability(add_decimals, new SkillLevel(.33)),
	new Ability(add_fractions, new SkillLevel(.96)),
	new Ability(multiply_decimals, new SkillLevel(.81)),
	new Ability(multiply_fractions, new SkillLevel(.47))
]);

next_problem = problems_available.find_best_problem_for_student(pumpkinofdoom, 0.95);
console.log("For " + pumpkinofdoom.name + ", we recommend: " + next_problem.handle);

var wonderbrain = new Student("WonderBrain", [
	new Ability(add_fractions, new SkillLevel(.23))
]);

next_problem = problems_available.find_best_problem_for_student(wonderbrain, 0.95);
console.log("For " + wonderbrain.name + ", we recommend: " + next_problem.handle);
