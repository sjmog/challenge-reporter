# Challenge Reporter

Grabs info from the Github API and Hub about cohort weekend challenge submissions.

Prototypes using challenge submissions to keep track of cohort success.

## Prerequisites

- npm

## Getting Started

- `npm install`. 
- Change the `CHALLENGE` constant (in ./index.js) to the name of the challenge you want to chronicle. (Default is `news-summary-challenge`)
- Grab a Github Access Token, add a `.env` and put it in like `GITHUB_ACCESS_TOKEN=your-token-here`.
- Run the program with `npm start`

## Where does the student data come from

It's pulled off Hub via the command-line, with the following instruction:

```ruby
Cohort.all.order(:start_date).map { |c| { c.name => c.matriculated_students.map(&:github_username) } }
```

It's then JS-ified. This could come from an API endpoint or even the Github API in future. I've removed any cohorts before November 2013 as the W/E challenges have changed too much for it to be useful.

I've also removed empty cohorts (especially future cohorts), although there's a guard if you're messy so feel free to chuck whatever data in you like :).

