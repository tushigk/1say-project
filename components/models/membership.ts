import { IImage } from "../models/image";

export type IMembershipPlan = MembershipPlan;

export class MembershipPlan implements IMembershipPlan {
  plans: IMembershipPlan[];
  _id: string;
  title: string;
  description: string;
  months: number;
  price: number;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
  image: IImage;

  constructor({
    plans,
    _id,
    title,
    description,
    months,
    price,
    isActive,
    sortOrder,
    createdAt,
    updatedAt,
    image,
  }: IMembershipPlan) {
    this._id = _id;
    this.title = title;
    this.description = description;
    this.months = months;
    this.price = price;
    this.isActive = isActive;
    this.sortOrder = sortOrder;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.image = image;
    this.plans = plans;
  }

  static fromJson(json: IMembershipPlan) {
    return new MembershipPlan(json);
  }
}
