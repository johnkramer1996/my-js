export default class Highlight {
  public static span(className: string, text: string): string {
    return `<span class='${className}'>${text}</span>`
  }
}
