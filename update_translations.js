const fs = require('fs');
const file = 'c:/Users/USER/OneDrive/Desktop/Code All/Little maker web/Little Maker Web-Update​​ - V02 (Update)/Little Maker Web-Update​​ - V02 (Update)/Little Maker Web-Update​​ - V02 (Update)/js/translations.js';
let content = fs.readFileSync(file, 'utf8');

const enKeys = `
    story_welcome:"Welcome to LITTLEMAKER (CAMBODIA)., LTD.",
    story_heritage_title:"Our Heritage & Expansion",
    story_heritage_desc:"Our journey began with our first establishment in Taiwan in 1993. Building on a solid foundation of industrial expertise, we expanded our operations by establishing our second factory in Vietnam in 2005. Continuing our legacy of growth and our strong commitment to the region, we established our third factory in Cambodia in 2025, strategically located in Svay Rieng province.",
    story_products_main_desc:"We take immense pride in manufacturing and supplying a diverse range of high-quality products tailored to our clients' needs, including:",
    story_prod_office_title:"Office Furniture",
    story_prod_office_desc:"Ergonomic office desks and cabinets meticulously designed to optimize your workspace and enhance productivity.",
    story_prod_tools_title:"Tools Cabinets",
    story_prod_tools_desc:"Heavy-duty, industrial-grade tool cabinets built to withstand the demands of factories and professional technicians.",
    story_prod_bbq_title:"BBQ Grills",
    story_prod_bbq_desc:"Premium quality BBQ grills crafted for durability and long-lasting performance, along with various other customized metal products.",
    story_eng_title:"Engineering Excellence",
    story_eng_desc:"We are more than just a production company; we are dedicated problem solvers. Our technical team specializes in translating complex requirements into tangible reality. Utilizing industry-standard tools like AutoCAD and SolidWorks, we design, draft, and execute projects with meticulous attention to detail. From comprehensive factory layouts to precise mechanical components, we build the foundation for operational efficiency.",
    story_commit_title:"Committed to Quality Standards",
    story_commit_desc:"Quality is at the core of everything we do. We operate strictly under the principles of ISO 9001 quality management, seamlessly integrating Lean Manufacturing and 5S methodologies into our daily operations. This rigorous approach ensures that every project and product we deliver is not only technically sound but also fully optimized for maximum productivity and safety.",
    story_future_title:"Looking Forward",
    story_future_desc:"As we continue to expand our capabilities across Asia, our vision remains clear: to be the most trusted engineering and manufacturing partner in Cambodia and beyond. We are LITTLEMAKER (CAMBODIA)., LTD. — building the future of industry, one precise solution at a time.",`;

const khKeys = `
    story_welcome:"សូមស្វាគមន៍មកកាន់ LITTLEMAKER (CAMBODIA)., LTD.",
    story_heritage_title:"ប្រវត្តិ និងការពង្រីកប្រតិបត្តិការរបស់យើង",
    story_heritage_desc:"ដំណើររឿងរបស់យើងបានចាប់ផ្តើមតាំងពីការបង្កើតរោងចក្រដំបូងនៅក្នុង ប្រទេសតៃវ៉ាន់ ក្នុងឆ្នាំ១៩៩៣។ ដោយផ្អែកលើមូលដ្ឋានគ្រឹះដ៏រឹងមាំនៃជំនាញឧស្សាហកម្ម យើងបានពង្រីកប្រតិបត្តិការរបស់យើងដោយបង្កើតរោងចក្រទី២ នៅក្នុង ប្រទេសវៀតណាម ក្នុងឆ្នាំ២០០៥។ ដើម្បីបន្តមរតកនៃការរីកចម្រើន និងការប្តេជ្ញាចិត្តនៅក្នុងតំបន់ យើងបានបង្កើតរោងចក្រទី៣ របស់យើងនៅក្នុង ប្រទេសកម្ពុជា នាឆ្នាំ២០២៥ ដែលមានទីតាំងយុទ្ធសាស្ត្រនៅក្នុងខេត្តស្វាយរៀង។",
    story_products_main_desc:"យើងមានមោទនភាពក្នុងការផលិត និងផ្គត់ផ្គង់ផលិតផលប្រកបដោយគុណភាពខ្ពស់ និងតម្រូវតាមតម្រូវការជាក់ស្តែងរបស់អតិថិជន រួមមាន៖",
    story_prod_office_title:"គ្រឿងសង្ហារិមការិយាល័យ",
    story_prod_office_desc:"តុ និងទូការិយាល័យ ដែលរចនាឡើងយ៉ាងយកចិត្តទុកដាក់សម្រាប់ភាពងាយស្រួល និងលើកកម្ពស់សោភ័ណភាពកន្លែងធ្វើការរបស់អ្នក។",
    story_prod_tools_title:"ទូដាក់ឧបករណ៍ (Tools Cabinets)",
    story_prod_tools_desc:"ទូដែកដាក់ឧបករណ៍ជាងដ៏រឹងមាំ និងធន់ ផលិតឡើងស្របតាមស្តង់ដារសម្រាប់រោងចក្រឧស្សាហកម្ម និងអ្នកបច្ចេកទេសអាជីព។",
    story_prod_bbq_title:"ចង្ក្រានអាំងសាច់ (BBQ Grills)",
    story_prod_bbq_desc:"ចង្ក្រានអាំងសាច់ដែលផលិតឡើងដោយផ្តោតលើគុណភាព ធានាបាននូវភាពធន់ និងការប្រើប្រាស់បានយូរអង្វែង ព្រមទាំងផលិតផលលោហៈជាច្រើនប្រភេទទៀត។",
    story_eng_title:"ឧត្តមភាពផ្នែកវិស្វកម្ម",
    story_eng_desc:"យើងមិនត្រឹមតែជាក្រុមហ៊ុនផលិតកម្មនោះទេ ប៉ុន្តែយើងគឺជាអ្នកផ្តល់ដំណោះស្រាយជាក់ស្តែង។ ក្រុមការងាររបស់យើងមានជំនាញក្នុងការប្រែក្លាយតម្រូវការបច្ចេកទេសស្មុគស្មាញឱ្យក្លាយជាលទ្ធផលពិតប្រាកដ។ តាមរយៈការប្រើប្រាស់កម្មវិធីស្តង់ដារអន្តរជាតិដូចជា AutoCAD និង SolidWorks យើងរចនា គូរប្លង់ និងអនុវត្តគម្រោងដោយយកចិត្តទុកដាក់បំផុតលើគ្រប់ព័ត៌មានលម្អិត។ ចាប់ពីការរៀបចំប្លង់ប្រព័ន្ធរោងចក្រ រហូតដល់ការផលិតគ្រឿងបន្លាស់មេកានិក យើងកសាងនូវមូលដ្ឋានគ្រឹះសម្រាប់ប្រសិទ្ធភាពការងាររបស់អ្នក។",
    story_commit_title:"ការប្តេជ្ញាចិត្តចំពោះស្តង់ដារគុណភាព",
    story_commit_desc:"គុណភាពគឺជាស្នូលនៃគ្រប់សកម្មភាពប្រតិបត្តិការរបស់យើង។ យើងប្រកាន់ខ្ជាប់យ៉ាងម៉ឺងម៉ាត់នូវគោលការណ៍គ្រប់គ្រងគុណភាពតាមស្តង់ដារ ISO 9001 ដោយបញ្ជ្រាបវិធីសាស្ត្រ Lean Manufacturing និង 5S ទៅក្នុងប្រតិបត្តិការរោងចក្រប្រចាំថ្ងៃ។ ការអនុវត្តយ៉ាងខ្ជាប់ខ្ជួននេះ គឺដើម្បីធានាថា រាល់ការងារ និងផលិតផលដែលយើងផ្តល់ជូនមិនត្រឹមតែមានស្តង់ដារបច្ចេកទេសត្រឹមត្រូវប៉ុណ្ណោះទេ ប៉ុន្តែថែមទាំងជួយជំរុញផលិតភាព និងធានាសុវត្ថិភាពខ្ពស់បំផុត។",
    story_future_title:"ទិសដៅឆ្ពោះទៅមុខ",
    story_future_desc:"ស្របពេលដែលយើងបន្តរីកចម្រើន ចក្ខុវិស័យរបស់យើងនៅតែច្បាស់លាស់ គឺការក្លាយជាដៃគូវិស្វកម្ម និងផលិតកម្មដែលគួរឱ្យទុកចិត្តបំផុតនៅក្នុងប្រទេសកម្ពុជា និងទីផ្សារអន្តរជាតិ។ យើងគឺជា LITTLEMAKER (CAMBODIA)., LTD. — រួមគ្នាកសាងអនាគតនៃវិស័យឧស្សាហកម្ម តាមរយៈដំណោះស្រាយដ៏ច្បាស់លាស់ប្រកបដោយនវានុវត្តន៍។",`;

const cnKeys = `
    story_welcome:"欢迎来到 LITTLEMAKER (CAMBODIA)., LTD.",
    story_heritage_title:"我们的历史与发展",
    story_heritage_desc:"我们的发展历程始于 1993年在台湾 建立的第一家工厂。依托扎实的工业专业基础，我们扩大了运营规模，于 2005年在越南 设立了第二家工厂。为了延续我们的发展蓝图并践行对本地区的坚定承诺，我们于 2025年在柬埔寨 柴桢省 (Svay Rieng) 的战略要地建立了第三家工厂。",
    story_products_main_desc:"我们非常自豪能够生产和提供多种量身定制的高品质产品，以满足客户的需求，主要包括：",
    story_prod_office_title:"办公家具",
    story_prod_office_desc:"精心设计的办公桌椅和文件柜，符合人体工程学，旨在优化您的工作空间并提高工作效率。",
    story_prod_tools_title:"工具柜 (Tools Cabinets)",
    story_prod_tools_desc:"专为工厂和专业技术人员打造的重型工业级工具柜，坚固耐用。",
    story_prod_bbq_title:"烧烤炉 (BBQ Grills)",
    story_prod_bbq_desc:"品质卓越、经久耐用的烧烤炉，以及各种其他定制金属产品。",
    story_eng_title:"卓越的工程技术",
    story_eng_desc:"我们不仅仅是一家生产制造企业，更是专注的解决方案提供商。我们的技术团队擅长将复杂的技术需求转化为现实。我们使用 AutoCAD 和 SolidWorks 等行业标准软件，对细节一丝不苟地进行项目设计、绘图和执行。从全面的工厂布局规划到精密的机械零部件加工，我们为您的高效运营奠定坚实基础。",
    story_commit_title:"对质量标准的坚定承诺",
    story_commit_desc:"质量是我们一切工作的核心。我们严格遵守 ISO 9001 质量管理体系原则，将精益生产 (Lean Manufacturing) 和 5S 管理方法无缝融入日常工厂运营中。这种严谨的态度确保了我们交付的每一个项目和产品不仅在技术上可靠，而且在提高生产力和保障安全性方面达到最优化。",
    story_future_title:"展望未来",
    story_future_desc:"随着我们在亚洲不断扩展业务能力，我们的愿景始终清晰：成为柬埔寨及其他地区最值得信赖的工程和制造合作伙伴。我们是 LITTLEMAKER (CAMBODIA)., LTD. — 通过每一个精准的解决方案，共创工业的未来。",`;

content = content.replace(/en:\{/, 'en:{\n' + enKeys);
content = content.replace(/kh:\{/, 'kh:{\n' + khKeys);
content = content.replace(/cn:\{/, 'cn:{\n' + cnKeys);

fs.writeFileSync(file, content, 'utf8');
console.log('Translations updated.');
