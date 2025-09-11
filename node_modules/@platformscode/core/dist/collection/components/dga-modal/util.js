export function ShowModal(name) {
    console.log("🚀 ~ ShowModal ~ name:", name);
    if (!name)
        return new Error("😒 Name is required");
    try {
        const dialog = document.querySelector(`#${name}`);
        dialog.style.display = "flex";
        if (!dialog)
            return new Error(`🥲 not found modal with name ${name}`);
        dialog.showModal();
        document.body.classList.add("modal-open");
    }
    catch (error) {
        console.log("🚀 ~ ShowModal ~ error:", error);
    }
}
export function HideModal(name) {
    if (!name)
        return new Error("😒 Name is required");
    try {
        const dialog = document.querySelector(`#${name}`);
        dialog.style.display = "none";
        if (!dialog)
            return new Error(`🥲 not found modal with name ${name}`);
        dialog.close();
        document.body.classList.remove("modal-open");
    }
    catch (error) {
        console.log("🚀 ~ HideModal ~ error:", error);
    }
}
