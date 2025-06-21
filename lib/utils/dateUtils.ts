

export function timeExpenseAdded (timestamp:string){

    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US",{
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,       
    });

}

export function formatDateHeader(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}