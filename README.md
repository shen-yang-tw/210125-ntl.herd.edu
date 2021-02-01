#### Guide ####
##	<Nvm> Install
1.	Install nvm-windows for windows, using an installer: https://github.com/coreybutler/nvm-windows/releases
		nvm-windows usage: https://github.com/coreybutler/nvm-windows#node-version-manager-nvm-for-windows
		nvm usage: https://github.com/nvm-sh/nvm#usage
2.	[Note]: Must <Restart Computer> after New installation otherwise webpack command `yarn run build` will get "node path" error

##	<Node & Npm>
* * Install or update to the latest: *** ` nvm install latest ` ***
	` nvm install latest `  //This will install the latest Node & Npm
		[option]: Istall an old version
	` nvm install 6.10.1 32 ` //usage: nvm install <version> //"32" means a 32 bit version
	` nvm list ` //List all versions
	` nvm use 15.3.0 ` //Use <version>

##	<Yarn> Install/Update: https://yarnpkg.com/latest.msi
1.	Test that Yarn is installed by running: *** ` yarn --version ` ***
	` yarn --version `

2.	Starting a new project: *** ` yarn init -y ` ***
	` yarn init ` //Creating <package.json> - https://classic.yarnpkg.com/en/docs/cli/init/#toc-yarn-init
	` yarn init -y ` //Creating <package.json> with default value

## Yarn https://classic.yarnpkg.com/en/docs/creating-a-project
* Run `yarn help COMMAND` for more information on specific commands - https://yarnpkg.com/en/docs/cli/
`yarn global add xxx` - https://classic.yarnpkg.com/en/docs/cli/add

## If use new node version, just delete all dependencies in package.json and run below:
* `yarn add handlebars @fortawesome/fontawesome-free tailwindcss postcss autoprefixer uikit bootstrap@next jquery ion-rangeslider FitText-UMD`
	remove: ``yarn global remove sass` then add: `yarn global add sass`
	remove: ``yarn global remove browser-sync` then add: `yarn global add browser-sync`
	remove: ``yarn global remove gulp-cli` then add: `yarn global add gulp-cli`
	If got errors just add "one by one": `yarn add @fullhuman/postcss-purgecss del gulp gulp-autoprefixer gulp-clean-css gulp-compile-handlebars gulp-concat gulp-dart-sass gulp-imagemin gulp-inject gulp-mode gulp-postcss gulp-rename gulp-replace gulp-uglify gulp-uglify-es imagemin-jpeg-recompress imagemin-pngquant postcss-import -D`

* `yarn install` Install all packages in dependencies of the package.json, then run ``yarn upgrade`` Not working on all packages
	Just run below
	Install: ***	`yarn install && upgrade && syncyarnlock -s -k` *** - https://www.npmjs.com/package/syncyarnlock#usage
	Update: ***	`yarn upgrade --latest --pattern && syncyarnlock -s -k` ***
	`-s`: Override the package.json, `-k`: Keep the prefix '^' or any other dynamic numbers
	Or change the package.json then run  - https://github.com/yarnpkg/yarn/issues/3266#issuecomment-573382303
	`yarn install && upgrade --latest`
* For Accessibility AA
	Find digits between "font-size:" and "px" in Visual Studio Code using: "font-size:(\d+)px" or "font-size:\s+(\d+)px"
  \d+ means one or more digits, \s+ means one or more whitespaces

---------------------------
0. `yarn start` or `gulp start`：It means to run `gulp vendors`, `gulp scss`, `gulp html`
1. `yarn server` or `gulp server`：It means to run  `gulp vendors`, `gulp scss`, `gulp html` then `gulp watch`
2. `yarn build`：It means to run `gulp build --production`
	 `yarn build-purge`：It means to run `gulp build-purge --purge`
	 `yarn build-nohtml`：It means to run `gulp build-nohtml --production`
---------------------------
`gulp vendors`：Output tailwind css, Copy vendors files to src & dist
`gulp scss`：Compile SCSS to CSS and Purge & Minify css, needed when modify scss
`gulp inject`：Inject path to all html files relative to /src
`gulp css`：Purge & Minify CSS to /dist
`gulp tailwind`：Output tailwind css and Minify to /src
`gulp tailwind --production`：Output tailwind css and Purge & Minify to /dist
`gulp html`：Inject path to all html files relative to /src and /dist [NO for different injection in html]