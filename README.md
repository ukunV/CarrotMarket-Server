## Architecture

![sdaf](https://user-images.githubusercontent.com/23329560/128726338-7fdd528f-553d-464e-8024-61a28c893587.JPG)

## Structure

```
├── 📂 config
│   ├── 📄 baseResponseStatus.js
│   ├── 📄 database.js
│   ├── 📄 express.js
│   ├── 📄 jwtMiddleware.js
│   ├── 📄 kakao_config.js
│   ├── 📄 mail_client.js
│   ├── 📄 mail_config.js
│   ├── 📄 ncp_client.js
│   ├── 📄 ncp_config.js
│   ├── 📄 response.js
│   ├── 📄 secret.js
│   └── 📄 winston.js
├── 📂 log
├── 📂 node_modules
├── 📂 src
│   └── 📂 app
│ 	   ├── 📂 Badge
│      │    ├── 📄 badgeDao.js
│ 	   │    ├── 📄 badgeController.js
│ 	   │    ├── 📄 badgeProvider.js
│ 	   │    └── 📄 badgeService.js
│ 	   ├── 📂 Chat
│      │    ├── 📄 chatDao.js
│ 	   │    ├── 📄 chatController.js
│ 	   │    ├── 📄 chatProvider.js
│ 	   │    └── 📄 chatService.js
│ 	   ├── 📂 Manner
│      │    ├── 📄 mannerDao.js
│ 	   │    ├── 📄 mannerController.js
│ 	   │    ├── 📄 mannerProvider.js
│ 	   │    └── 📄 mannerService.js
│ 	   ├── 📂 Merchandise
│      │    ├── 📄 merchandiseDao.js
│ 	   │    ├── 📄 merchandiseController.js
│ 	   │    ├── 📄 merchandiseProvider.js
│ 	   │    └── 📄 merchandiseService.js
│ 	   ├── 📂 Notice
│      │    ├── 📄 noticeDao.js
│ 	   │    ├── 📄 noticeController.js
│ 	   │    ├── 📄 noticeProvider.js
│ 	   │    └── 📄 noticeService.js
│ 	   ├── 📂 Review
│      │    ├── 📄 reviewDao.js
│ 	   │    ├── 📄 reviewController.js
│ 	   │    ├── 📄 reviewProvider.js
│ 	   │    └── 📄 reviewService.js
│ 	   └── 📂 User
│    	    ├── 📄 userDao.js
│ 	 	    ├── 📄 userController.js
│ 	 	    ├── 📄 userProvider.js
│ 	 	    └── 📄 userService.js
│
├── 📄 .gitattributes
├── 📄 .gitignore
├── 📄 index.js
├── 📄 package-lock.json
├── 📄 package.json
└── 📄 README.md
```

## ERD (AqueryTool)

[CarrotMarket - ERD](https://aquerytool.com/aquerymain/index/?rurl=2dfdcc71-f60a-4306-ac9d-8b303411339a)

> password: 57nb74

## API Specification

[CarrotMarket - API Specification](https://docs.google.com/spreadsheets/d/1rSCdo6pP4Xo8qxCNOJFs7G3DFJ0R3hfqZhpsfFGTzbw/edit?usp=sharing)
