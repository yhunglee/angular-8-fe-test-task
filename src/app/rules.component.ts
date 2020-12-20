import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.scss']
})
export class RulesComponent implements OnInit {


  @Input('header') header: string = '';
  @Input('description') description: string = '';


  rulesForm: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
  ) { }

  ngOnInit() {

    this._setFormInitial();
  }


  /**
   * 初始化表單
   */
  private _setFormInitial() {

    this.rulesForm = this._formBuilder.group({
      'collection': this._formBuilder.array([this._addOneRule()]),
    });

  }

  private _addOneRule(isAddByManual?: boolean) {
    /**
     * Fields:
     * 1. category
     * 2. match type
     * 3. url
     */
    let prevCategoryVal = 'all';
    if (isAddByManual !== undefined && isAddByManual === true) {

      /**
       * 手動增加規則時，自動使用上一規則的分類欄位值
       */

      let currentLength = this.formRuleCollection.length;

      prevCategoryVal = (currentLength > 0) ? this.formRuleCollection.controls[currentLength-1].get('category').value : prevCategoryVal;
    }

    return this._formBuilder.group({
      'category': new FormControl(prevCategoryVal),
      'match-type': new FormControl('contains'),
      'url': new FormControl('', [Validators.required]),
    });

  }

  /**
   * 增加一條規則
   */
  onAddOneRule() {
    this.formRuleCollection.push(this._addOneRule(true));
  }

  get formRuleCollection() {
    return this.rulesForm.get('collection') as FormArray;
  }

  /**
   * 改變規則類別
   * @param event
   * @param urlField
   */
  onChangeCategory(event, urlField: AbstractControl) {

    switch (event.target.value.toString()) {
      case 'custom': {


        urlField.setValidators([Validators.required]);
        break;
      }
      default: {


        urlField.setValidators(null);
        break;
      }
    }

    urlField.updateValueAndValidity();

  }

  /**
   * 刪除一條規則
   * @param idx
   */
  onDeleteOneRule(idx) {

    this.formRuleCollection.removeAt(idx);

  }
}
