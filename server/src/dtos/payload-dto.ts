export default class PayloadDTO {
  public idSimple: number;
  public id: string;
  public nickname: string;
  public nicknameSlug: string;
  public bio: string;
  public location: string;
  public links: Array<object>;
  public interests: Array<string>;
  public avatarUrl: string;
  public banExpires: string;
  public lastOnline: string;
  public email: string;
  public role: object;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(model: any) {
    this.idSimple = model.idSimple;
    this.id = String(model._id);
    this.nickname = model.nickname;
    this.nicknameSlug = model.nicknameSlug;
    this.bio = model.bio;
    this.location = model.location;
    this.links = model.links;
    this.interests = model.interests;
    this.avatarUrl = model.avatarUrl;
    this.banExpires = model.banExpires;
    this.lastOnline = model.lastOnline;
    this.email = model.email;
    this.role = model.role;
    this.createdAt = model.createdAt;
    this.updatedAt = model.updatedAt;
  }
}
