import axios from 'axios';

export async function resetDB(flashShow, resetInfo, fullResetCycles) {
    const message = `All information will be deleted! User Accounts, Payment Cycles, Members, Contribution Records & Welfare Records. Are you sure you want to delete everything?`;

    if (confirm(message)) {
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for 2 seconds
        await fullResetCycles(); // Wait for the cycles reset to complete
        await resetInfo();
    } else {
        flashShow('Database Reset Cancelled!', 'info');
        // Reload info
        await resetInfo();
    }
}

export async function fullResetCycles(
    flashShow,
    flashLoading,
    flashHide,
    resetInfo,
    fullResetMembers,
    reloadNav,
    classInfo
) {
    if (confirm('Are You Sure you want to delete all Payment Cycles with Member Payments, Welfares, Projects & Expenses?')) {
        flashLoading('Deleting all Payment Cycles with Member Payments, Welfares, Projects & Expenses');
        try {
            const { data } = await axios.get('/fullReset/cycles');
            classInfo.setup = data[0];
            classInfo.membersNo = data[1];
            classInfo.cyclesNo = data[2];
            classInfo.projectsNo = data[3];
            flashHide();
            await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for 2 seconds
            flashShow('All Payment Cycles with Member Payments, Welfares, Projects & Expenses Deleted', 'delete');
            await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for 2 seconds
            await fullResetMembers(); // Wait for the members reset to complete
            reloadNav();
        } catch (error) {
            console.error('Error resetting payment cycles:', error);
        }
    } else {
        flashShow('Payment Cycles Reset Cancelled!', 'warning');
        // Reload info
        await resetInfo();
    }
}

export async function fullResetMembers(
    flashShow,
    flashLoading,
    flashHide,
    resetInfo,
    fullResetUsers,
    reloadNav,
    classInfo
) {
    if (confirm('Are You Sure you want to delete all Members?')) {
        flashLoading('Deleting all Members!');
        try {
            const { data } = await axios.get('/fullReset/members');
            classInfo.setup = data[0];
            classInfo.membersNo = data[1];
            classInfo.cyclesNo = data[2];
            classInfo.projectsNo = data[3];
            flashHide();
            await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for 2 seconds
            flashShow('All Members Deleted', 'delete');
            await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for 2 seconds
            await fullResetUsers(); // Wait for the users reset to complete
            reloadNav();
        } catch (error) {
            console.error('Error resetting members:', error);
        }
    } else {
        flashShow('Members Reset Cancelled!', 'warning');
        // Reload info
        await resetInfo();
    }
}

export async function fullResetUsers(
    flashShow,
    flashLoading,
    flashHide,
    resetInfo,
    getRegister,
    reloadNav,
    classInfo
) {
    if (confirm('Are You Sure you want to delete all User Accounts, Including yourself?')) {
        flashLoading('Deleting all User Accounts');
        try {
            const { data } = await axios.get('/fullReset/users');
            classInfo.setup = data[0];
            classInfo.membersNo = data[1];
            classInfo.cyclesNo = data[2];
            classInfo.projectsNo = data[3];
            flashHide();
            await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for 2 seconds
            flashShow('All User Accounts Deleted', 'delete');
            await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for 2 seconds
            await getRegister();
            reloadNav();
        } catch (error) {
            console.error('Error resetting users:', error);
        }
    } else {
        flashShow('Users Reset Cancelled!', 'warning');
        // Reload info
        await resetInfo();
    }
}