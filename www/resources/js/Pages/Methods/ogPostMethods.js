// original functions
// and on chatgpt: https://chatgpt.com/c/67269b5a-45e0-8005-9a88-382d8a941c69

// check file upload cycle forms used in main-cycle
// export function useFileUpload(classInfo, pluralCheck, { flashTimed, flashHide, flashShow, flashMessages, loadingOn, loadingOk, loadingError, clearFile }) {
//     const onChangeFile = (event) => {
//         if (classInfo.year && classInfo.month) {
//             clearFile();
//             flashTimed(`Checking Ledger: Months, Payments, Existing & New Member(s)!`, 'loading', 40000);
//             loadingOn();
//             classInfo.fileSelected = event.target.files.length;
//             classInfo.excel_file = event.target.files[0];
//             classInfo.upload_info = `${event.target.files[0].name} ${Number(event.target.files[0].size / (1024 * 1024)).toFixed(2)} MBs`;

//             const config = {
//                 headers: {
//                     'content-type': 'multipart/form-data'
//                 }
//             };

//             const file = event.target.files[0];
//             const data = new FormData();
//             data.append('excel', file);

//             axios.post(`/payments/check/excel/${classInfo.month}/${classInfo.year}`, data, config)
//                 .then(({ data }) => {
//                     flashHide();
//                     classInfo.members_existing = data.existing_count;
//                     classInfo.members_left = data.new_count;
//                     classInfo.members_count = data.existing_count + data.new_count;
//                     classInfo.oldMembers = data.existing_members;
//                     classInfo.newMembers = data.new_members;
//                     classInfo.allMembers = data.all_members;
//                     classInfo.exist = data.exist;

//                     classInfo.monthsInfo = data.monthly_contributions;
//                     classInfo.monthsCount = data.months_count;
//                     classInfo.expInCount = data.monthsexpin_no;
//                     classInfo.expOweCount = data.monthsexpowe_no;
//                     classInfo.totalPay = data.total_pay;
//                     classInfo.totalIn = data.total_in;
//                     classInfo.totalOwe = data.total_owe;

//                     const messages = [
//                         {
//                             info: data.existing_count > 0
//                                 ? `${classInfo.members_existing} existing ${pluralCheck(data.existing_count, 'member')}, in ${classInfo.year} info will be updated!`
//                                 : `No (0) existing members in the spreadsheet!`,
//                             type: 'members', delay: 100, duration: 15000
//                         },
//                         {
//                             info: data.new_count > 0
//                                 ? `${classInfo.members_left} new ${pluralCheck(data.new_count, 'member')}, in ${classInfo.year} info will be submitted - If No new member exists check spellings on the spreadsheet!`
//                                 : `No (0) new members in the spreadsheet!`,
//                             type: 'newMembers', delay: 200, duration: data.new_count > 0 ? 20000 : 16000
//                         },
//                         {
//                             info: data.months_count > 0
//                                 ? `Contributions - KSH ${Number(classInfo.totalPay).toLocaleString()} : ${classInfo.monthsCount} ${pluralCheck(data.months_count, 'contribution')} in the ${classInfo.month} ${classInfo.year}!`
//                                 : `Contributions - No (0) monthly contributions in the spreadsheet!`,
//                             type: 'info', delay: 300, duration: 17000
//                         },
//                         {
//                             info: data.monthsexpin_no > 0
//                                 ? `Welfare In - KSH ${Number(classInfo.totalIn).toLocaleString()} : ${classInfo.expInCount} ${pluralCheck(data.expInCount, 'welfare')} in the ${classInfo.month} ${classInfo.year}!`
//                                 : `Welfare In - No (0) welfare payments in the spreadsheet!`,
//                             type: 'info', delay: 400, duration: 18000
//                         },
//                         {
//                             info: data.monthsexpowe_no > 0
//                                 ? `Welfare Owed - KSH ${Number(classInfo.totalOwe).toLocaleString()} : ${classInfo.expOweCount} ${pluralCheck(data.expOweCount, 'owed welfare')} in the ${classInfo.month} ${classInfo.year}!`
//                                 : `Welfare Owed - No (0) owed welfare payments in the spreadsheet!`,
//                             type: 'info', delay: 500, duration: 19000
//                         },
//                         { info: `Spreadsheet Analysis Complete`, type: 'success', delay: 5500, duration: 20000 }
//                     ];

//                     loadingOk();
//                     flashMessages(messages);
//                 })
//                 .catch((error) => {
//                     loadingError();
//                     if (error.response && error.response.data.errors) {
//                         error.response.data.errors.excel.forEach((err) => flashShow(err, 'danger'));
//                     }
//                 });
//         } else {
//             if (!classInfo.month) flashShow('Fill in the month', 'danger');
//             if (!classInfo.year) flashShow('Fill in the year', 'danger');
//         }
//     };

//     return { onChangeFile };
// }

// // check file upload members forms used in main-members
// export function useFileUploadMembers(classInfo, pluralCheck, { flashShow, flashMessages, clearAll }) {
//     const onChangeFileMembers = (event) => {
//         if (classInfo.hasFile) {
//             clearAll();
//         }
//         classInfo.labelClass = classInfo.labelLoading;
//         classInfo.fileSelected = event.target.files.length;
//         classInfo.excel_file = event.target.files[0];
//         classInfo.file_name = event.target.files[0].name;
//         classInfo.file_size = Number(event.target.files[0].size / (1024 * 1024)).toFixed(2);
//         classInfo.upload_info = 'File Name ' + classInfo.file_name + ' ' + classInfo.file_size + ' MBs';

//         const config = {
//             headers: {
//                 'content-type': 'multipart/form-data'
//             }
//         }

//         let file = event.target.files[0];

//         let fileData = file;
//         let data = new FormData();
//         data.append('excel', fileData);

//         // Check if members exist
//         axios.post('/members/excel/exist/', data, config)
//             .then(({ data }) => {
//                 classInfo.members_existing = data.existing_count;
//                 classInfo.members_left  = data.new_count;
//                 classInfo.members_count = data.existing_count + data.new_count;
//                 classInfo.oldMembers    = data.existing_members;
//                 classInfo.newMembers    = data.new_members;
//                 classInfo.allMembers    = data.all_members;
//                 classInfo.exist         = data.exist;

//                 // Array to hold messages
//                 let messages = [];

//                 // Helper function to generate message info
//                 const createMessage = (info, type, delay, duration) => ({
//                     info,
//                     type,
//                     delay,
//                     duration
//                 });

//                 // Simplified messages array creation
//                 messages.push(
//                     createMessage(
//                         data.existing_count > 0
//                             ? `${classInfo.members_existing} existing ${pluralCheck(data.existing_count, 'member')}, info will be updated!`
//                             : `No (0) existing members in the spreadsheet!`,
//                         'members', 100, 15000
//                     ),
//                     createMessage(
//                         data.new_count > 0
//                             ? `${classInfo.members_left} new ${pluralCheck(data.new_count, 'member')}, info will be submitted - If No new member exists check spellings on the spreadsheet!`
//                             : `No (0) new members in the spreadsheet!`,
//                         'newMembers', 200, data.new_count > 0 ? 20000 : 16000
//                     ),
//                     createMessage(`Spreadsheet Analysis Complete`, 'success', 300, 20000)
//                 );

//                 classInfo.labelClass = classInfo.labelInfo;

//                 // Loop through messages and display them
//                 flashMessages(messages);
//             })
//             .catch(error => {
//                 if (error.response && error.response.data.errors) {
//                     error.response.data.errors.excel.forEach((err) => flashShow(err, 'danger'));
//                 }
//             });
//     };

//     return { onChangeFileMembers };
// }

// // check file upload members forms used in main-ledger
// export function useFileUploadLedgers(classInfo, pluralCheck, { flashShow, flashMessages, flashLoading, loadingOn, loadingOk, loadingError, clearAll }) {
//     const onChangeFileLedgers = (event) => {
//         if (classInfo.hasFile) {
//             clearAll();
//         }
//         flashLoading(`Checking Ledger: Months, Payments, Existing & New Member(s)!`);
//         loadingOn();
//         classInfo.fileSelected = event.target.files.length;
//         classInfo.excel_file = event.target.files[0];
//         classInfo.upload_info = event.target.files[0].name;

//         classInfo.file_size = Number(event.target.files[0].size / (1024 * 1024)).toFixed(2);
//         classInfo.upload_info = 'File Name ' + event.target.files[0].name + ' ' + classInfo.file_size + ' MBs';

//         const config = {
//             headers: {
//                 'content-type': 'multipart/form-data'
//             }
//         }

//         let file = event.target.files[0];

//         let fileData = file;
//         let data = new FormData();
//         data.append('excel', fileData);

//         axios.post('/ledger/check/excel/' + classInfo.year, data, config)
//             .then(({ data }) => {
//                 classInfo.members_existing = data.existing_count;
//                 classInfo.members_left = data.new_count;
//                 classInfo.members_count = data.existing_count + data.new_count;
//                 classInfo.oldMembers = data.existing_members;
//                 classInfo.newMembers = data.new_members;
//                 classInfo.allMembers = data.all_members;
//                 classInfo.exist = data.exist;

//                 classInfo.monthsInfo = data.monthly_contributions;
//                 classInfo.monthsCount = data.months_count;
//                 classInfo.totalPay = data.total_pay;
//                 classInfo.totalIn = data.total_in;
//                 classInfo.totalOwe = data.total_owe;
//                 classInfo.totalInv = data.total_inv;
//                 classInfo.totalOweMay = data.total_owemay;

//                 // totalContributions = memberContributions.reduce((sum, member) => sum + member.total_contributions, 0)

//                 // Array to hold messages
//                 let messages = [];

//                 // Helper function to generate message info
//                 const createMessage = (info, type, delay = 500, duration = 15000) => ({
//                     info,
//                     type,
//                     delay,
//                     duration
//                 });

//                 messages.push(
//                     createMessage(
//                         data.existing_count > 0
//                             ? `${classInfo.members_existing} existing ${pluralCheck(data.existing_count, 'member')}, in ${classInfo.year} info will be updated!`
//                             : `No (0) existing members in the spreadsheet!`,
//                         'members', 100, 15000
//                     ),
//                     createMessage(
//                         data.new_count > 0
//                             ? `${classInfo.members_left} new ${pluralCheck(data.new_count, 'member')}, in ${classInfo.year} info will be submitted - If No new member exists check spellings on the spreadsheet!`
//                             : `No (0) new members in the spreadsheet!`,
//                         'newMembers', 150, data.new_count > 0 ? 20000 : 16000
//                     ),
//                     createMessage(
//                         data.months_count > 0
//                             ? `UPLOADED: ${classInfo.monthsCount} ${pluralCheck(data.months_count, 'month')} in ${classInfo.year} Spreadsheet!`
//                             : `No (0) months in the spreadsheet!`,
//                         'info', 200, 17000
//                     ),
//                     createMessage(
//                         data.total_pay > 0
//                             ? `Total Contributions - KSH ${Number(classInfo.totalPay).toLocaleString()} in ${classInfo.year} Speadsheet!`
//                             : `Total Contributions - No (0) contribution payments in the spreadsheet!`,
//                         'success', 250, 18000
//                     ),
//                     createMessage(
//                         data.total_in > 0
//                             ? `Total Welfare In - KSH ${Number(classInfo.totalIn).toLocaleString()} in ${classInfo.year} Speadsheet!`
//                             : `Total Welfare In - No (0) welfare payments in the spreadsheet!`,
//                         'success', 300, 18000
//                     ),
//                     createMessage(
//                         data.total_owe > 0
//                             ? `Total Welfare Owed Till April - KSH ${Number(classInfo.totalOwe).toLocaleString()} in ${classInfo.year} Speadsheet!`
//                             : `Total Welfare Owed Till April - No (0) owed welfare payments in the spreadsheet!`,
//                         'success', 350, 19000
//                     ),
//                     createMessage(
//                         data.total_owemay > 0
//                             ? `Total Welfare Owed From May - KSH ${Number(classInfo.totalOweMay).toLocaleString()} in ${classInfo.year} Speadsheet!`
//                             : `Total Welfare Owed From May - No (0) owed welfare payments in the spreadsheet!`,
//                         'success', 400, 19000
//                     ),
//                     createMessage(
//                         data.total_inv > 0
//                             ? `Total Investment - KSH ${Number(classInfo.totalInv).toLocaleString()} in ${classInfo.year} Speadsheet!`
//                             : `No (0) Total Investment in the spreadsheet!`,
//                         'success', 450, 18000
//                     )
//                 );

//                 // Simplified messages array creation
//                 // Loop through months to create dynamic messages
//                 Object.entries(classInfo.monthsInfo).forEach(([month, contributions], index) => {
//                     // Calculate the sum of contributions' amounts for the current month
//                     let amountSum = contributions.reduce((total, contribution) => total + contribution.amount, 0);

//                     messages.push(
//                         createMessage(
//                             `${month} ${classInfo.year} - ${contributions.length} ${pluralCheck(contributions.length, 'contribution')}: Ksh ${Number(amountSum).toLocaleString()}.`,
//                             'ledger',
//                             3500 + (index * 1000),
//                             20000
//                         )
//                     );
//                 });

//                 // Final Ledger Analysis Complete message
//                 // messages.push(
//                 //     createMessage('Ledger Months & Member Analysis Complete', 'info', 4500, 25000)
//                 // );

//                 loadingOk();

//                 flashMessages(messages);
//             })
//             .catch(error => {
//                 loadingError();
//                 if (error.response.data.errors) {
//                     let errors = error.response.data.errors.excel;
//                     errors.forEach(error => {
//                         flashShow(error, 'danger');
//                     });
//                 }
//             });
//     };

//     return { onChangeFileLedgers };
// }

// check file upload cycle forms used in main-cycle 
// export function useFileUpload(classInfo, pluralCheck, { flashTimed, flashHide, flashShow, flashMessages, loadingOn, loadingOk, loadingError, clearFile }) {
//     const onChangeFile = (event) => {
//         if (classInfo.year && classInfo.month) {
//             clearFile();
//             flashTimed(`Checking Ledger: Months, Payments, Existing & New Member(s)!`, 'loading', 40000);
//             loadingOn();
//             classInfo.fileSelected = event.target.files.length;
//             classInfo.excel_file = event.target.files[0];
//             classInfo.upload_info = `${event.target.files[0].name} ${Number(event.target.files[0].size / (1024 * 1024)).toFixed(2)} MBs`;

//             const config = {
//                 headers: {
//                     'content-type': 'multipart/form-data'
//                 }
//             };

//             const file = event.target.files[0];
//             const data = new FormData();
//             data.append('excel', file);

//             axios.post(`/payments/check/excel/${classInfo.month}/${classInfo.year}`, data, config)
//                 .then(({ data }) => {
//                     flashHide();
//                     classInfo.members_existing = data.existing_count;
//                     classInfo.members_left = data.new_count;
//                     classInfo.members_count = data.existing_count + data.new_count;
//                     classInfo.oldMembers = data.existing_members;
//                     classInfo.newMembers = data.new_members;
//                     classInfo.allMembers = data.all_members;
//                     classInfo.exist = data.exist;

//                     classInfo.monthsInfo = data.monthly_contributions;
//                     classInfo.monthsCount = data.months_count;
//                     classInfo.expInCount = data.monthsexpin_no;
//                     classInfo.expOweCount = data.monthsexpowe_no;
//                     classInfo.totalPay = data.total_pay;
//                     classInfo.totalIn = data.total_in;
//                     classInfo.totalOwe = data.total_owe;

//                     const messages = [
//                         {
//                             info: data.existing_count > 0
//                                 ? `${classInfo.members_existing} existing ${pluralCheck(data.existing_count, 'member')}, in ${classInfo.year} info will be updated!`
//                                 : `No (0) existing members in the spreadsheet!`,
//                             type: 'members', delay: 100, duration: 15000
//                         },
//                         {
//                             info: data.new_count > 0
//                                 ? `${classInfo.members_left} new ${pluralCheck(data.new_count, 'member')}, in ${classInfo.year} info will be submitted - If No new member exists check spellings on the spreadsheet!`
//                                 : `No (0) new members in the spreadsheet!`,
//                             type: 'newMembers', delay: 200, duration: data.new_count > 0 ? 20000 : 16000
//                         },
//                         {
//                             info: data.months_count > 0
//                                 ? `Contributions - KSH ${Number(classInfo.totalPay).toLocaleString()} : ${classInfo.monthsCount} ${pluralCheck(data.months_count, 'contribution')} in the ${classInfo.month} ${classInfo.year}!`
//                                 : `Contributions - No (0) monthly contributions in the spreadsheet!`,
//                             type: 'info', delay: 300, duration: 17000
//                         },
//                         {
//                             info: data.monthsexpin_no > 0
//                                 ? `Welfare In - KSH ${Number(classInfo.totalIn).toLocaleString()} : ${classInfo.expInCount} ${pluralCheck(data.expInCount, 'welfare')} in the ${classInfo.month} ${classInfo.year}!`
//                                 : `Welfare In - No (0) welfare payments in the spreadsheet!`,
//                             type: 'info', delay: 400, duration: 18000
//                         },
//                         {
//                             info: data.monthsexpowe_no > 0
//                                 ? `Welfare Owed - KSH ${Number(classInfo.totalOwe).toLocaleString()} : ${classInfo.expOweCount} ${pluralCheck(data.expOweCount, 'owed welfare')} in the ${classInfo.month} ${classInfo.year}!`
//                                 : `Welfare Owed - No (0) owed welfare payments in the spreadsheet!`,
//                             type: 'info', delay: 500, duration: 19000
//                         },
//                         { info: `Spreadsheet Analysis Complete`, type: 'success', delay: 5500, duration: 20000 }
//                     ];

//                     loadingOk();
//                     flashMessages(messages);
//                 })
//                 .catch((error) => {
//                     loadingError();
//                     if (error.response && error.response.data.errors) {
//                         error.response.data.errors.excel.forEach((err) => flashShow(err, 'danger'));
//                     }
//                 });
//         } else {
//             if (!classInfo.month) flashShow('Fill in the month', 'danger');
//             if (!classInfo.year) flashShow('Fill in the year', 'danger');
//         }
//     };

//     return { onChangeFile };
// }

// // check file upload members forms used in main-members
// export function useFileUploadMembers(classInfo, pluralCheck, { flashShow, flashMessages, clearAll }) {
//     const onChangeFileMembers = (event) => {
//         if (classInfo.hasFile) {
//             clearAll();
//         }
//         classInfo.labelClass = classInfo.labelLoading;
//         classInfo.fileSelected = event.target.files.length;
//         classInfo.excel_file = event.target.files[0];
//         classInfo.file_name = event.target.files[0].name;
//         classInfo.file_size = Number(event.target.files[0].size / (1024 * 1024)).toFixed(2);
//         classInfo.upload_info = 'File Name ' + classInfo.file_name + ' ' + classInfo.file_size + ' MBs';

//         const config = {
//             headers: {
//                 'content-type': 'multipart/form-data'
//             }
//         }

//         let file = event.target.files[0];

//         let fileData = file;
//         let data = new FormData();
//         data.append('excel', fileData);

//         // Check if members exist
//         axios.post('/members/excel/exist/', data, config)
//             .then(({ data }) => {
//                 classInfo.members_existing = data.existing_count;
//                 classInfo.members_left = data.new_count;
//                 classInfo.members_count = data.existing_count + data.new_count;
//                 classInfo.oldMembers = data.existing_members;
//                 classInfo.newMembers = data.new_members;
//                 classInfo.allMembers = data.all_members;
//                 classInfo.exist = data.exist;

//                 // Array to hold messages
//                 let messages = [];

//                 // Helper function to generate message info
//                 const createMessage = (info, type, delay, duration) => ({
//                     info,
//                     type,
//                     delay,
//                     duration
//                 });

//                 // Simplified messages array creation
//                 messages.push(
//                     createMessage(
//                         data.existing_count > 0
//                             ? `${classInfo.members_existing} existing ${pluralCheck(data.existing_count, 'member')}, info will be updated!`
//                             : `No (0) existing members in the spreadsheet!`,
//                         'members', 100, 15000
//                     ),
//                     createMessage(
//                         data.new_count > 0
//                             ? `${classInfo.members_left} new ${pluralCheck(data.new_count, 'member')}, info will be submitted - If No new member exists check spellings on the spreadsheet!`
//                             : `No (0) new members in the spreadsheet!`,
//                         'newMembers', 200, data.new_count > 0 ? 20000 : 16000
//                     ),
//                     createMessage(`Spreadsheet Analysis Complete`, 'success', 300, 20000)
//                 );

//                 classInfo.labelClass = classInfo.labelInfo;

//                 // Loop through messages and display them
//                 flashMessages(messages);
//             })
//             .catch(error => {
//                 if (error.response && error.response.data.errors) {
//                     error.response.data.errors.excel.forEach((err) => flashShow(err, 'danger'));
//                 }
//             });
//     };

//     return { onChangeFileMembers };
// }

// // check file upload members forms used in main-ledger
// export function useFileUploadLedgers(classInfo, pluralCheck, { flashShow, flashMessages, flashLoading, loadingOn, loadingOk, loadingError, clearAll }) {
//     const onChangeFileLedgers = (event) => {
//         if (classInfo.hasFile) {
//             clearAll();
//         }
//         flashLoading(`Checking Ledger: Months, Payments, Existing & New Member(s)!`);
//         loadingOn();
//         classInfo.fileSelected = event.target.files.length;
//         classInfo.excel_file = event.target.files[0];
//         classInfo.upload_info = event.target.files[0].name;

//         classInfo.file_size = Number(event.target.files[0].size / (1024 * 1024)).toFixed(2);
//         classInfo.upload_info = 'File Name ' + event.target.files[0].name + ' ' + classInfo.file_size + ' MBs';

//         const config = {
//             headers: {
//                 'content-type': 'multipart/form-data'
//             }
//         }

//         let file = event.target.files[0];

//         let fileData = file;
//         let data = new FormData();
//         data.append('excel', fileData);

//         axios.post('/ledger/check/excel/' + classInfo.year, data, config)
//             .then(({ data }) => {
//                 classInfo.members_existing = data.existing_count;
//                 classInfo.members_left = data.new_count;
//                 classInfo.members_count = data.existing_count + data.new_count;
//                 classInfo.oldMembers = data.existing_members;
//                 classInfo.newMembers = data.new_members;
//                 classInfo.allMembers = data.all_members;
//                 classInfo.exist = data.exist;

//                 classInfo.monthsInfo = data.monthly_contributions;
//                 classInfo.monthsCount = data.months_count;
//                 classInfo.totalPay = data.total_pay;
//                 classInfo.totalIn = data.total_in;
//                 classInfo.totalOwe = data.total_owe;
//                 classInfo.totalInv = data.total_inv;
//                 classInfo.totalOweMay = data.total_owemay;

//                 // totalContributions = memberContributions.reduce((sum, member) => sum + member.total_contributions, 0)

//                 // Array to hold messages
//                 let messages = [];

//                 // Helper function to generate message info
//                 const createMessage = (info, type, delay = 500, duration = 15000) => ({
//                     info,
//                     type,
//                     delay,
//                     duration
//                 });

//                 messages.push(
//                     createMessage(
//                         data.existing_count > 0
//                             ? `${classInfo.members_existing} existing ${pluralCheck(data.existing_count, 'member')}, in ${classInfo.year} info will be updated!`
//                             : `No (0) existing members in the spreadsheet!`,
//                         'members', 100, 15000
//                     ),
//                     createMessage(
//                         data.new_count > 0
//                             ? `${classInfo.members_left} new ${pluralCheck(data.new_count, 'member')}, in ${classInfo.year} info will be submitted - If No new member exists check spellings on the spreadsheet!`
//                             : `No (0) new members in the spreadsheet!`,
//                         'newMembers', 150, data.new_count > 0 ? 20000 : 16000
//                     ),
//                     createMessage(
//                         data.months_count > 0
//                             ? `UPLOADED: ${classInfo.monthsCount} ${pluralCheck(data.months_count, 'month')} in ${classInfo.year} Spreadsheet!`
//                             : `No (0) months in the spreadsheet!`,
//                         'info', 200, 17000
//                     ),
//                     createMessage(
//                         data.total_pay > 0
//                             ? `Total Contributions - KSH ${Number(classInfo.totalPay).toLocaleString()} in ${classInfo.year} Speadsheet!`
//                             : `Total Contributions - No (0) contribution payments in the spreadsheet!`,
//                         'success', 250, 18000
//                     ),
//                     createMessage(
//                         data.total_in > 0
//                             ? `Total Welfare In - KSH ${Number(classInfo.totalIn).toLocaleString()} in ${classInfo.year} Speadsheet!`
//                             : `Total Welfare In - No (0) welfare payments in the spreadsheet!`,
//                         'success', 300, 18000
//                     ),
//                     createMessage(
//                         data.total_owe > 0
//                             ? `Total Welfare Owed Till April - KSH ${Number(classInfo.totalOwe).toLocaleString()} in ${classInfo.year} Speadsheet!`
//                             : `Total Welfare Owed Till April - No (0) owed welfare payments in the spreadsheet!`,
//                         'success', 350, 19000
//                     ),
//                     createMessage(
//                         data.total_owemay > 0
//                             ? `Total Welfare Owed From May - KSH ${Number(classInfo.totalOweMay).toLocaleString()} in ${classInfo.year} Speadsheet!`
//                             : `Total Welfare Owed From May - No (0) owed welfare payments in the spreadsheet!`,
//                         'success', 400, 19000
//                     ),
//                     createMessage(
//                         data.total_inv > 0
//                             ? `Total Investment - KSH ${Number(classInfo.totalInv).toLocaleString()} in ${classInfo.year} Speadsheet!`
//                             : `No (0) Total Investment in the spreadsheet!`,
//                         'success', 450, 18000
//                     )
//                 );

//                 // Simplified messages array creation
//                 // Loop through months to create dynamic messages
//                 Object.entries(classInfo.monthsInfo).forEach(([month, contributions], index) => {
//                     // Calculate the sum of contributions' amounts for the current month
//                     let amountSum = contributions.reduce((total, contribution) => total + contribution.amount, 0);

//                     messages.push(
//                         createMessage(
//                             `${month} ${classInfo.year} - ${contributions.length} ${pluralCheck(contributions.length, 'contribution')}: Ksh ${Number(amountSum).toLocaleString()}.`,
//                             'ledger',
//                             3500 + (index * 1000),
//                             20000
//                         )
//                     );
//                 });

//                 // Final Ledger Analysis Complete message
//                 // messages.push(
//                 //     createMessage('Ledger Months & Member Analysis Complete', 'info', 4500, 25000)
//                 // );

//                 loadingOk();

//                 flashMessages(messages);
//             })
//             .catch(error => {
//                 loadingError();
//                 if (error.response.data.errors) {
//                     let errors = error.response.data.errors.excel;
//                     errors.forEach(error => {
//                         flashShow(error, 'danger');
//                     });
//                 }
//             });
//     };

//     return { onChangeFileLedgers };
// }
// Submit / Update Cycle main-cycle & main-ledger
// export function onSubmitLedgerAsync(classInfo, { flashShow, flashTimed, flashHide, loadingError, postContributionsAsync }) {
//     const submitLedgerAsync = async () => {
//         if (confirm(classInfo.confirmText)) {
//             flashHide();
//             // Loop through each month in the contributions
//             for (const [month, contributions] of Object.entries(classInfo.monthsInfo)) {
//                 // start flash
//                 let newMessage = '';
//                 newMessage = ${ month } ${ classInfo.year } Processing, Please Wait....
//                 flashTimed(newMessage, 'loading', 40000);

//                 try {
//                     // Send the POST request for each cycle
//                     const { data } = await axios.post(/import/ledger / cycles / modal / ${ month } / ${ classInfo.year })

//                     classInfo.cycleID = data.id;
//                     classInfo.cycleName = data.name;

//                     flashTimed(${ data.message }, Upload Success, data.type, 40000);

//                     // post the contributions in the cycle
//                     await postContributionsAsync(classInfo.cycleID, classInfo.cycleName, contributions)
//                 } catch (error) {
//                     loadingError();

//                     // Log the main error message
//                     console.error('Error Message:', error.response.data.message);

//                     // Check if there are validation errors
//                     if (error.response.data.errors) {
//                         // Iterate through the errors and log each one
//                         for (const [key, errorMessages] of Object.entries(error.response.data.errors)) {
//                             errorMessages.forEach(errorMessage => {
//                                 console.error(Error for ${ key }: ${ errorMessage });
//                             flashShow(errorMessage, 'danger'); // Display error messages in the UI
//                         });
//                     }
//                 }
//             }
//         }
//     } else {
//         flashHide();
//     flashShow('Ledger Upload Cancelled', 'danger');
// }
//     };

// return { submitLedgerAsync };
// }

// // Submit / Update Payments per cycles main-cycle & main-ledger
// export function onPostContributionsAsync(classInfo, { flashTimed, checkCycleInfo, loadingError, flashAllHide }) {
//     const postContributionsAsync = async (id, name, contributions) => {
//         try {
//             // Notification for starting the process
//             flashTimed(${ name } info processing, please wait..., 'loading', 20000);

//             // Iterate over contributions and post them sequentially
//             for (const [index, { name, member_id, cycle_id, amount, expin_amount, expowe_amount }] of contributions.entries()) {
//                 // remaining Payments
//                 const remainingPays = contributions.length - index - 1;

//                 const contributionData = {
//                     name,
//                     member_id,
//                     cycle_id,
//                     amount,
//                     expin_amount,
//                     expowe_amount,
//                 };

//                 // Send POST request for each contribution
//                 const { data } = await axios.post(/import/ledger / monthly / ${ id }, contributionData);
//                 flashTimed(${ data.message }: ${ remainingPays } Contributions Left, data.type, 2000);

//                 // After all pays are updated, show a final flash message
//                 if (remainingPays === 0) {
//                     flashAllHide();
//                     setTimeout(() => {
//                         checkCycleInfo(classInfo.cycleID);
//                     }, 1000);
//                 }
//             }

//         } catch (error) {
//             // Handle errors after the entire loop
//             loadingError();
//             if (error.response?.data?.errors) {
//                 error.response.data.errors.excel.forEach(err => flashTimed(err, 'danger', 30000));
//             } else {
//                 flashTimed(${ name } Failed., 'danger', 60000);
//             }
//         }
//     };

//     return { postContributionsAsync };
// }

// // Update Records in the sys
// export function onCheckCycleInfo(classInfo, { flashTimed }) {
//     const checkCycleInfo = async () => {
//         try {
//             // Send the GET request for cycle info
//             const response = await axios.get(/update/cycle / info / ${ classInfo.cycleID });

//             // Destructure the info object safely
//             const info = response.data || {}; // Fallback to an empty object if info is undefined

//             // Check if info has the expected properties
//             if (info[0] && info[1]) {
//                 flashTimed(${ info[0]}, info[1], 40000);
//             } else {
//                 console.error('Unexpected response structure:', info);
//             }
//         } catch (error) {
//             console.error('Error fetching cycle info:', error);
//             flashTimed('Failed to update cycle info', 'danger', 40000);
//         }
//     };

//     return { checkCycleInfo };
// }

// // Function to update all cycle info
// const { checkCycleInfo } = onCheckCycleInfo(classInfo, { flashTimed });

// // Function to post contributions for a given cycle
// const { postContributionsAsync } = onPostContributionsAsync(classInfo, {flashTimed, checkCycleInfo, loadingError, flashAllHide });

// // submit cycle spreadsheet
// const { submitLedgerAsync } = onSubmitLedgerAsync(classInfo, { flashShow, flashTimed, flashHide, loadingError, postContributionsAsync });