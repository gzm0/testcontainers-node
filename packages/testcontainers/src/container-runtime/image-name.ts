export class ImageName {
  public readonly string: string;

  constructor(
    public readonly registry: string | undefined,
    public readonly image: string,
    public readonly tag: string
  ) {
    if (this.registry) {
      if (this.tag.startsWith("sha256:")) {
        this.string = `${this.registry}/${this.image}@${this.tag}`;
      } else {
        this.string = `${this.registry}/${this.image}:${this.tag}`;
      }
    } else if (this.tag.startsWith("sha256:")) {
      this.string = `${this.image}@${this.tag}`;
    } else {
      this.string = `${this.image}:${this.tag}`;
    }
  }

  public equals(other: ImageName): boolean {
    return this.registry === other.registry && this.image === other.image && this.tag === other.tag;
  }

  public static fromString(string: string): ImageName {
    const registry = this.getRegistry(string);
    const stringWithoutRegistry = registry ? string.split("/").slice(1).join("/") : string;

    if (stringWithoutRegistry.includes("@")) {
      const [image, tag] = stringWithoutRegistry.split("@");
      return new ImageName(registry, image, tag);
    } else if (stringWithoutRegistry.includes(":")) {
      const [image, tag] = stringWithoutRegistry.split(":");
      return new ImageName(registry, image, tag);
    } else {
      return new ImageName(registry, stringWithoutRegistry, "latest");
    }
  }

  private static getRegistry(string: string): string | undefined {
    const parts = string.split("/");

    if (parts.length > 1 && this.isRegistry(parts[0])) {
      return parts[0];
    }
  }

  private static isRegistry(string: string): boolean {
    return string.includes(".") || string.includes(":") || string === "localhost";
  }
}
